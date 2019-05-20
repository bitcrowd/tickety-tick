// Make error objects JSON-serializable so error details do not get lost
// between the content script and the extension popup.
export default function serializable(error) {
  return {
    message: error.message,
  };
}
