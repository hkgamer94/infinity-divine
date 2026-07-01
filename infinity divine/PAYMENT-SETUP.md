# Razorpay payment setup

The checkout interface is ready for Razorpay UPI, cards and net banking. Live charging stays disabled until the secure server connection is configured.

1. Create a Razorpay merchant account and complete its required business verification.
2. Generate a Test Key ID and Key Secret in Razorpay.
3. Create a protected server endpoint that:
   - receives product IDs and quantities;
   - reads current prices from the trusted database;
   - calculates the final amount on the server;
   - creates a Razorpay order using the secret key;
   - returns only the Razorpay order ID, amount and currency.
4. Verify the Razorpay payment signature on the server before marking an order paid.
5. Put only the public Key ID and endpoint URL into `payment-config.js`.

Never place the Razorpay Key Secret in HTML, JavaScript, Git, or browser storage. Use hosting environment secrets for it.
