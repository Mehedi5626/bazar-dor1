const API_BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export async function getProducts() {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/products`, {
      cache: "no-store",
    });
  } catch {
    throw new Error("API সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না।");
  }

  if (!response.ok) {
    throw new Error(`পণ্যের API থেকে error এসেছে: ${response.status}`);
  }

  const result = await response.json();

  // API সরাসরি array অথবা object-এর মধ্যে products দিতে পারে।
  const products = Array.isArray(result)
    ? result
    : result?.data?.products ??
      result?.products ??
      result?.data ??
      [];

  if (!Array.isArray(products)) {
    throw new Error("API থেকে পণ্যের তালিকা পাওয়া যায়নি।");
  }

  return products;
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("ক্যাটাগরির তথ্য পাওয়া যায়নি।");
  }

  const result = await response.json();

  const categories = Array.isArray(result)
    ? result
    : result?.data?.categories ??
      result?.categories ??
      result?.data ??
      [];

  if (!Array.isArray(categories)) {
    throw new Error("API থেকে ক্যাটাগরির তালিকা পাওয়া যায়নি।");
  }

  return categories;
}