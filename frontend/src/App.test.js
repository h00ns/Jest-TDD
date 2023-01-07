import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import App from "./App"

test("From order to order completion", async () => {
  render(<App />);

  // America 여행 상품 2개 추가
  const americaInput = await screen.findByRole("spinbutton", {
    name: "America",
  });
  userEvent.clear(americaInput);
  userEvent.type(americaInput, "2");

  // England 여행 상품 3개 추가
  const englandInput = await screen.findByRole("spinbutton", {
    name: "England",
  });
  userEvent.clear(englandInput);
  userEvent.type(englandInput, "3");

  // Insurance 옵션 체크
  const insuranceInput = await screen.findByRole("checkbox", {
    name: "Insurance",
  });
  userEvent.click(insuranceInput);

  // 모든 주문을 한 이후 주문 버튼 클릭
  const orderButton = screen.getByRole("button", {
    name: "주문하기",
  });
  userEvent.click(orderButton);

  /**
   *  주문 확인 페이지
   */

  // 제목
  const summaryHeading = screen.getByRole("heading", {
    name: "주문 확인"
  });
  expect(summaryHeading).toBeInTheDocument();

  // 여행 상품 총 가격
  const productsHeading = screen.getByRole("heading", {
    name: "여행 상품: 5000"
  });
  expect(productsHeading).toBeInTheDocument();

  // 옵션 총 가격
  const optionsHeading = screen.getByRole("heading", {
    name: "옵션: 500"
  });
  expect(optionsHeading).toBeInTheDocument();

  // 특정 상품 나열
  expect(screen.getByText("2 America")).toBeInTheDocument();
  expect(screen.getByText("3 England")).toBeInTheDocument();
  expect(screen.getByText("Insurance")).toBeInTheDocument();

  // 체크박스 클릭
  const confirmCheckBox = screen.getByRole("checkbox", {
    name: "주문하려는 것을 확인하셨나요?"
  });
  userEvent.click(confirmCheckBox);

  // 버튼 클릭
  const confirmOrderButton = screen.getByRole("button", {
    name: "주문 확인"
  });
  userEvent.click(confirmOrderButton);

  /**
   *  주문 완료 페이지
   */
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  const completeHeading = await screen.findByRole("heading", {
    name: "주문이 성공했습니다.",
  });
  expect(completeHeading).toBeInTheDocument();

  const loadingDisappeared = screen.queryByText("loading");
  expect(loadingDisappeared).not.toBeInTheDocument();

  const firstPageButton = screen.getByRole("button", {
    name: "첫페이지로",
  });
  userEvent.click(firstPageButton);

  const productsTotal = screen.getByText("상품 총 가격: 0");
  expect(productsTotal).toBeInTheDocument();
  const optionsTotal = screen.getByText("옵션 총 가격: 0");
  expect(optionsTotal).toBeInTheDocument();


  // 첫페이지로 버튼을 첫페이지로 가서 컴포넌트 렌더링, 비동기 호출이 일어나나
  // 테스트는 끝나버려서 not wrapped in act 에러가 나타남
  // waitFor 함수 or findBy 사용 ! -> 첫페이지 행동을 기다려줘야함
  await waitFor(() => {
    screen.getByRole("spinbutton", { name: "America" });
    screen.getByRole("checkbox", { name: "Insurance" });
  })
  // await screen.findByRole("spinbutton", { name: "America" });
})