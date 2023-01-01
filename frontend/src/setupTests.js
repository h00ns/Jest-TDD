// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { server } from './mocks/server';

// 테스트 시작전 서버 listen
beforeAll(() => server.listen());

// 각 테스트 끝난 후 핸들러 초기화
afterEach(() => server.resetHandlers());

// 테스트 끝난 후 서버 close
afterAll(() => server.close());