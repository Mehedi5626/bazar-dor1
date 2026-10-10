import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

async function getApiData(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const json = await response.json();

  if (json.success === false) {
    throw new Error(json.message || "API request failed");
  }

  return json.data ?? json.products ?? json.categories ?? json;
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  for (const key of ["products", "categories", "items", "result"]) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [];
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().normalize("NFC");
}

function getCategoryName(category) {
  return (
    category.nameBn ??
    category.categoryNameBn ??
    category.name ??
    category.categoryName ??
    category.title ??
    ""
  );
}

function getCategorySlug(category) {
  return String(
    category.slug ??
      category.categorySlug ??
      category.category_slug ??
      category.category ??
      category.id ??
      ""
  );
}

function getProductSlug(product) {
  return product.slug ?? product.id ?? product._id;
}

function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) return "দাম নেই";

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

function getUnit(unit) {
  if (unit === "kg") return "কেজি";
  if (unit === "liter") return "লিটার";
  if (unit === "piece") return "টি";
  if (unit === "dozen") return "ডজন";
  return unit || "একক উল্লেখ নেই";
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let categories;
  let products;

  try {
    const [categoryData, productData] = await Promise.all([
      getApiData("/categories"),
      getApiData("/products"),
    ]);

    categories = getArray(categoryData);
    products = getArray(productData);
  } catch (error) {
    console.error("Category API error:", error);

    return (
      <main className="detail-page">
        <h1>তথ্য লোড করা যায়নি</h1>
        <p>ক্যাটাগরি বা পণ্যের তথ্য আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।</p>
        <Link href="/" className="back-link">
          ← হোমপেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const category = categories.find(
    (item) =>
      normalize(getCategorySlug(item)) === normalize(decodedSlug) ||
      normalize(getCategoryName(item)) === normalize(decodedSlug)
  );

  const matchingProducts = products.filter((product) => {
    const productCategory = normalize(product.category);

    return (
      productCategory === normalize(decodedSlug) ||
      productCategory === normalize(getCategorySlug(category ?? {})) ||
      productCategory === normalize(getCategoryName(category ?? {}))
    );
  });

  if (!category && matchingProducts.length === 0) {
    notFound();
  }

  const categoryName = category
    ? getCategoryName(category)
    : matchingProducts[0]?.categoryNameBn ?? decodedSlug;

  return (
    <main className="section">
      <Link href="/" className="back-link">
        ← হোমপেজে ফিরে যান
      </Link>

      <div className="section-heading" style={{ marginTop: 24 }}>
        <div>
          <span className="eyebrow">পণ্যের ক্যাটাগরি</span>
          <h1>{categoryName}</h1>
          <p>এই ক্যাটাগরির পণ্যের দাম ও বিস্তারিত তথ্য দেখুন।</p>
        </div>
      </div>

      {matchingProducts.length > 0 ? (
        <div className="product-grid">
          {matchingProducts.map((product, index) => {
            const productSlug = getProductSlug(product);
            const price = Number(product.today);

            return (
              <article
                className="product-card"
                key={product.slug ?? product.id ?? index}
              >
                <div className="product-visual">
                  <span>
                    {product.image ?? product.categoryIcon ?? "🛒"}
                  </span>
                  <small>{product.categoryNameBn ?? categoryName}</small>
                </div>

                <div className="product-info">
                  <h3>{product.nameBn ?? product.name ?? "পণ্যের নাম নেই"}</h3>

                  <div className="product-price">
                    <strong>
                      {Number.isFinite(price)
                        ? `৳${formatPrice(price)}`
                        : "দাম নেই"}
                    </strong>
                    {Number.isFinite(price) && (
                      <span>/{getUnit(product.unit)}</span>
                    )}
                  </div>

                  <p className="old-price">
                    {product.yesterday != null
                      ? `গতকাল: ৳${formatPrice(product.yesterday)}`
                      : "আগের দামের তথ্য নেই"}
                  </p>

                  {productSlug != null && (
                    <Link
                      href={`/product/${encodeURIComponent(String(productSlug))}`}
                      className="product-link"
                    >
                      বিস্তারিত দেখুন →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p>এই ক্যাটাগরিতে কোনো পণ্যের তথ্য পাওয়া যায়নি।</p>
      )}
    </main>
  );
}