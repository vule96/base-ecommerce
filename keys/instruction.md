# Add in this directory your RSA Keys

1. private.pem
2. public.pem

Example files are provided in the directory.

## Generating RSA Keys

You can generate RSA keys using OpenSSL. Here's how:

1.  **Generate RSA Private Key:**
    Open a terminal or command prompt and run the following command to generate a 2048-bit RSA private key:

    ```
    openssl genrsa -out private.pem 2048
    ```

    This command creates a `private.pem` file containing your private key.

    _Note: NIST recommends a minimum of 2048-bit keys for RSA. Although a 4096-bit key size provides a reasonable increase in strength, it also significantly increases CPU usage; therefore, 2048-bit keys are generally recommended._

2.  **Extract Public Key:**
    To extract the corresponding public key from the private key, use the following command:

    ```
    openssl rsa -in private.pem -pubout -out public.pem
    ```

    This command reads the `private.pem` file and creates a `public.pem` file containing your public key.

    After executing this command, verify that the `public.pem` file starts with `-----BEGIN PUBLIC KEY-----` to confirm it contains the public key.

These keys can be used for encryption and decryption. Keep your `private.pem` file secure, as it's essential for decryption. The `public.pem` file can be shared with others.
