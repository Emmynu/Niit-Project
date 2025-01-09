function payKorapay() {
    window.Korapay.initialize({
        key: "pk_test_PHfVru7a8V9Dum9fnXEritZke3nEU8UTXiAtSDwb",
        reference: "your-unique-reference",
        amount: 22000, 
        currency: "NGN",
        customer: {
          name: "John Doe",
          email: "john@doe.com"
        },
        notification_url: "https://example.com/webhook"
    });
}