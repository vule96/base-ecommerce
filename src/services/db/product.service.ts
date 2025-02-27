import { AttributeValue, Product, ProductVariant, ProductVariantOption, Variant, VariantOption } from '@prisma/client';
import { v7 } from 'uuid';

import { prisma } from '~/components/prisma';
import { ErrNotFound } from '~/core/error';
import type { ProductCreateDTO, ProductDTO, ProductUpdateDTO } from '~/modules/product/product.schema';
import { ProductStatus } from '~/shared/interface';
import type { ToNullProps } from '~/shared/interface/utility';
import type { Paginated, PagingDTO } from '~/shared/model';
import { toSlug } from '~/utils/string';

class ProductService {
  public create = async (data: ToNullProps<ProductCreateDTO>): Promise<Product> => {
    const newId = v7();
    const newProduct: ProductDTO = {
      ...data,
      id: newId,
      slug: toSlug(data.name),
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return prisma.product.create({
      data: {
        ...newProduct
      }
    });
  };

  public findById = async (id: Product['id']) => {
    const product = await prisma.product.findUnique({
      where: { id },
      omit: {
        categoryId: true
      },
      include: {
        category: true,
        productAttributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true
              }
            }
          }
        },
        productVariants: {
          include: {
            productVariantOptions: {
              include: {
                variantOption: {
                  include: {
                    variant: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!product) {
      throw ErrNotFound.withLog(`The product with ${id} not found`);
    }

    return this.formatProductResponse(product);
  };

  public update = async (id: Product['id'], data: ProductUpdateDTO) => {
    await this.findById(id);

    const preData = {
      ...data,
      slug: data.name ? toSlug(data.name) : undefined
    };

    const updatedProduct = await prisma.product.update({ where: { id }, data: preData });
    return updatedProduct;
  };

  public list = async (paging: PagingDTO): Promise<Paginated<Product>> => {
    const count = await prisma.product.count();

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.product.findMany({
      skip,
      take: paging.limit,
      orderBy: { createdAt: 'desc' }
    });

    return {
      data: result,
      paging: {
        page: paging.page,
        limit: paging.limit,
        total: count
      }
    };
  };

  private formatProductResponse = (
    product: Omit<Product, 'categoryId'> & {
      productAttributes: {
        attributeValue: Pick<AttributeValue, 'id' | 'value'> & { attribute: { name: string } };
      }[];
    } & {
      productVariants: Array<
        Pick<ProductVariant, 'id' | 'price' | 'stock' | 'sku' | 'barcode' | 'soldCount'> & {
          productVariantOptions: Array<ProductVariantOption & { variantOption: VariantOption & { variant: Variant } }>;
        }
      >;
    }
  ) => {
    const { productAttributes, productVariants, ...restProduct } = product;

    return {
      ...restProduct,
      attributes: productAttributes.map((item) => ({
        id: item.attributeValue.id,
        name: item.attributeValue.attribute.name,
        value: item.attributeValue.value
      })),
      variants: productVariants.map(({ id, price, stock, sku, barcode, soldCount, productVariantOptions }) => ({
        id,
        price,
        stock,
        sku,
        barcode,
        soldCount,
        options: this.groupVariantOptionsByProductVariantId(productVariantOptions)
      }))
    };
  };

  private groupVariantOptionsByProductVariantId = (
    options: Array<ProductVariantOption & { variantOption: VariantOption & { variant: Variant } }>
  ) => {
    const result: Record<string, any> = {};

    options.forEach((item) => {
      const productVariantId = item.productVariantId;

      if (!result[productVariantId]) {
        result[productVariantId] = [];
      }

      const variantOption = {
        id: item.variantOption.id,
        name: item.variantOption.variant.name,
        value: item.variantOption.value
      };

      result[productVariantId].push(variantOption);
    });

    return Object.keys(result).map((productVariantId) => ({
      productVariantId,
      variantOptions: result[productVariantId]
    }));
  };
}

export const productService: ProductService = new ProductService();
