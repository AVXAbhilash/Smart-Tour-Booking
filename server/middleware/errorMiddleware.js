const errorHandler = (err, req, res, next) => {
  // If the Express status code is still sitting at the default 200 (OK), 
  // force it to a 500 (Internal Server Error) since an error was thrown.
  // Otherwise, respect the custom status code we set in our controllers (like 400, 401, 403, 404).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Security Best Practice: Only show the exact file path and line number of the crash 
    // when you are in development mode. Hide it in production!
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;