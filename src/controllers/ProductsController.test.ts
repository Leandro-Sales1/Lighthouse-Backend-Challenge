import request from "supertest";
import app from "../app";

describe("ProductsController", () => {

  it("should return 200 and the list oof products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
  });
});
