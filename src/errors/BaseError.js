class BaseError extends Error {
  constructor(message = "Server error", status = 500) {
    super();

    this.message = message;
    this.status = status;
  }

  sendResponse(res) {
    console.log(`Error: ${this.message} - Status: ${this.status}`);

    res.status(this.status).send({
      message: this.message,
      status: this.status,
    });
  }
}

export default BaseError;
