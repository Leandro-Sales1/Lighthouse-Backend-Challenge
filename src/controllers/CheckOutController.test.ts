import request from "supertest";
import app from "../app";

describe("CheckOutController", () => {
  
  it("should return 400 if cart is empty or not an array", async () => {
    const res = await request(app).post("/cart").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid cart, must be a non-empty array.");
  });

  it("should return 400 if cart has duplicate SKUs", async () => {
    const res = await request(app)
      .post("/cart")
      .send({ cart: [{ SKU: "123", quantity: 1 }, { SKU: "123", quantity: 2 }] });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid cart, duplicate SKUs are not allowed.");
  });

  it("should return 400 if a product is missing SKU or has invalid quantity", async () => {
    const res = await request(app)
      .post("/cart")
      .send({ cart: [{ SKU: "43N23P", quantity: 0 }] });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid cart, all the products must have a valid SKU and quantity > 0.");
  });

  it("should return 404 if no products are found", async () => {
    const res = await request(app)
      .post("/cart")
      .send({ cart: [{ SKU: "INVALID_SKU", quantity: 1 }] });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ops... No products found, check your SKU. ");
  });

  it("should return 200 if cart is valid", async () => {
    const res = await request(app)
      .post("/cart")
      .send({ cart: [{ SKU: "43N23P", quantity: 1 }] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("cartTotalPrice");
    expect(res.body.products).toHaveLength(1);
  });
});
