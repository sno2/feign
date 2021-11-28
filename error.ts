export type FeignErrorInit = {
  type: "expected";
  location: string;
  got: string;
  expected: string;
  expectedExclusion?: boolean;
} | {
  type: "no-input";
  location: string;
} | {
  type: "unknown";
  message: string;
};

function createErrorMessage(init: FeignErrorInit): string {
  switch (init.type) {
    case "expected":
      return `Expected${
        init.expectedExclusion === true ? " none in" : ""
      } '${init.expected}', got '${init.got}' for ${init.location}.`;
    case "no-input":
      return `Expected input, got <empty string> at ${init.location}.`;
    case "unknown":
      return init.message;
  }
}

export class FeignError extends SyntaxError {
  readonly init: FeignErrorInit;

  constructor(init: FeignErrorInit) {
    super(createErrorMessage(init));
    this.init = init;
  }
}
