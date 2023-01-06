// import { render, screen } from "@testing-library/react"
import { render, screen } from "../../../test-utils"
import userEvent from "@testing-library/user-event";
import Type from "../Type"
import OrderPage from "../OrderPage"
// import { OrderContextProvider } from "../../../contexts/OrderContext";

test("update product's total when products change", async () => {
  // render(<Type orderType="products" />, { wrapper: OrderContextProvider })
  render(<Type orderType="products" />)

  // 여기서 exact는 text 뒤에 어떤 text가 더있어도 반환함
  const productsTotal = screen.getByText("상품 총 가격:", { exact: false });
  expect(productsTotal).toHaveTextContent("0");

  // America 여행 상품 한개 올리기 (BE에서 정보를 가져와야 생기므로 findBy)
  const americaInput = await screen.findByRole("spinbutton", {
    name: "America",
  });
  userEvent.clear(americaInput);
  userEvent.type(americaInput, "1");
  expect(productsTotal).toHaveTextContent("1000");

  // England 여행 상품 3개 더 올리기
  const englandInput = await screen.findByRole("spinbutton", {
    name: "England",
  });
  userEvent.clear(englandInput);
  userEvent.type(englandInput, "3");
  expect(productsTotal).toHaveTextContent("4000");
})

test("update option's total when options change", async () => {
  render(<Type orderType="options" />);

  // 옵션 총 가격의 0부터 시작
  const optionsTotal = screen.getByText('옵션 총 가격:', { exact: false });
  expect(optionsTotal).toHaveTextContent("0");

  // 보험 옵션 추가
  const insuranceCheckbox = await screen.findByRole('checkbox', {
    name: 'Insurance',
  });
  userEvent.click(insuranceCheckbox);
  expect(optionsTotal).toHaveTextContent("500");

  // 디너 옵션 추가
  const dinnerCheckbox = await screen.findByRole('checkbox', {
    name: 'Dinner',
  });
  userEvent.click(dinnerCheckbox);
  expect(optionsTotal).toHaveTextContent("1000");

  // 디너 옵션 제거
  userEvent.click(dinnerCheckbox);
  expect(optionsTotal).toHaveTextContent("500");
})

describe("total price of goods and options", () => {
  test("total price starts with 0 and Updating total price when adding one product", async () => {
    render(<OrderPage />);

    const total = screen.getByText("Total Price:", { exact: false });
    expect(total).toHaveTextContent("0");

    const americaInput = await screen.findByRole("spinbutton", {
      name: 'America'
    });
    userEvent.clear(americaInput);
    userEvent.type(americaInput, "1");

    expect(total).toHaveTextContent("1000");
  });

  test("Updating total price when adding one option", async () => {
    render(<OrderPage />);

    const total = screen.getByText("Total Price:", { exact: false });

    const insuranceCheckbox = await screen.findByRole('checkbox', {
      name: 'Insurance',
    });
    userEvent.click(insuranceCheckbox);
    expect(total).toHaveTextContent("500");
  });

  test("Updating total price when removing option and product", async () => {
    render(<OrderPage />);

    const total = screen.getByText("Total Price:", { exact: false });

    const insuranceCheckbox = await screen.findByRole('checkbox', {
      name: 'Insurance',
    });
    userEvent.click(insuranceCheckbox);

    const americaInput = await screen.findByRole("spinbutton", {
      name: 'America'
    });
    userEvent.clear(americaInput);
    userEvent.type(americaInput, "3");

    userEvent.clear(americaInput);
    userEvent.type(americaInput, "1");

    expect(total).toHaveTextContent("1500");
  });
})