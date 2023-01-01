import { render, screen } from "@testing-library/react";
import { server } from "../../../mocks/server";
import Type from "../Type";
import { rest } from "msw";

test("displays product images from server", async () => {
  render(<Type orderType="products" />);

  // 이미지 찾기
  const productImages = await screen.findAllByRole("img", {
    name: /product$/i,
  });
  expect(productImages).toHaveLength(2);

  const altText = productImages.map((element) => element.alt);
  expect(altText).toEqual(["America product", "England product"]);
});

test("when fetching product datas, face an error", async () => {
  // 500 에러 발생시킴 -> 렌더링 전에 덮어씌움
  server.resetHandlers(
    rest.get('http://localhost:5000/products', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<Type orderType='products' />);

  const errorBanner = await screen.findByTestId("error-banner");
  expect(errorBanner).toHaveTextContent("에러가 발생했습니다.");
});

test("fetch option information from server", async () => {
  render(<Type orderType='options' />)

  const optionCheckboxes = await screen.findAllByRole("checkbox");
  expect(optionCheckboxes).toHaveLength(2);
})