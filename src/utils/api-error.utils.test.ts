import { describe, expect, it } from "@jest/globals";
import { AxiosError, AxiosHeaders } from "axios";
import { ApiRequestError, getApiErrorMessage, toApiError } from "./api-error.utils";

// Builds an AxiosError the way axios does for an HTTP error response
const httpError = (status: number, data: unknown) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe("toApiError", () => {
  it("reads the unified 422 body: string message + errors[]", () => {
    const result = toApiError(
      httpError(422, {
        statusCode: 422,
        error: "UNPROCESSABLE_ENTITY",
        message: "Dữ liệu không hợp lệ",
        errors: [{ field: "email", message: "Trường này là bắt buộc" }],
      })
    );

    expect(result).toMatchObject({
      kind: "http",
      status: 422,
      error: "UNPROCESSABLE_ENTITY",
      message: "Dữ liệu không hợp lệ",
      fieldErrors: [{ field: "email", message: "Trường này là bắt buộc" }],
    });
  });

  it("still reads the old 422 body (message: [{ message, path }])", () => {
    const result = toApiError(httpError(422, { message: [{ message: "Required", path: "email" }] }));

    expect(result.message).toBeUndefined();
    expect(result.fieldErrors).toEqual([{ field: "email", message: "Required" }]);
  });

  it("tells network errors and cancellations apart from HTTP errors", () => {
    expect(toApiError(new AxiosError("Network Error", "ERR_NETWORK")).kind).toBe("network");
    expect(toApiError(new AxiosError("canceled", AxiosError.ERR_CANCELED)).kind).toBe("cancel");
    expect(toApiError(new Error("boom"))).toMatchObject({ kind: "unknown", message: "boom" });
  });
});

describe("getApiErrorMessage", () => {
  it("shows the summary followed by each invalid field", () => {
    const error = httpError(422, {
      message: "Dữ liệu không hợp lệ",
      errors: [{ field: "email", message: "Trường này là bắt buộc" }],
    });

    expect(getApiErrorMessage(error, "fallback")).toBe("Dữ liệu không hợp lệ: email: Trường này là bắt buộc");
  });

  it("uses the backend message, or the fallback when there is none", () => {
    expect(getApiErrorMessage(httpError(401, { message: "Sai email hoặc mật khẩu" }), "x")).toBe(
      "Sai email hoặc mật khẩu"
    );
    expect(getApiErrorMessage(httpError(500, {}), "fallback")).toBe("fallback");
  });
});

describe("ApiRequestError", () => {
  it("keeps the user-facing message and exposes status and field errors", () => {
    const source = httpError(422, {
      message: "Dữ liệu không hợp lệ",
      errors: [{ field: "email", message: "Trường này là bắt buộc" }],
    });
    const error = new ApiRequestError(toApiError(source), getApiErrorMessage(source, "x"));

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Dữ liệu không hợp lệ: email: Trường này là bắt buộc");
    expect(error.status).toBe(422);
    expect(error.fieldErrors).toHaveLength(1);
    expect(toApiError(error)).toBe(error.apiError);
  });
});
