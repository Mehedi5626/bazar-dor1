import Link from "next/link";

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

function getProductName(product) {
  return product.nameBn ?? product.name ?? product.title ?? "পণ্যের নাম নেই";
}

function getProductPrice(product) {
  const price = Number(product.today);
  return Number.isFinite(price) ? price : null;
}

function getProductUnit(unit) {
  if (unit === "kg") return "কেজি";
  if (unit === "liter") return "লিটার";
  if (unit === "piece") return "টি";
  if (unit === "dozen") return "ডজন";
  return unit || "একক উল্লেখ নেই";
}

function getCategoryName(category) {
  return (
    category.nameBn ??
    category.categoryNameBn ??
    category.name ??
    category.categoryName ??
    category.title ??
    "ক্যাটাগরি"
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

function formatPrice(price) {
  if (price == null) return "দাম নেই";

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

function ProductCard({ product }) {
  const slug = getProductSlug(product);
  const price = getProductPrice(product);
  const change = product.change ?? {};
  const previousPrice = Number(product.yesterday);
  const unit = getProductUnit(product.unit);

  return (
    <article className="product-card">
      <div className="product-visual">
        <span>{product.image ?? product.categoryIcon ?? "🛒"}</span>
        <small>{product.categoryNameBn ?? product.category ?? "পণ্য"}</small>
      </div>

      <div className="product-info">
        <h3>{getProductName(product)}</h3>

        <div className="product-price">
          <strong>
            {price == null ? "দাম নেই" : `৳${formatPrice(price)}`}
          </strong>
          {price != null && <span>/{unit}</span>}
        </div>

        <p className="old-price">
          {Number.isFinite(previousPrice) && product.yesterday != null
            ? `গতকাল: ৳${formatPrice(previousPrice)} / ${unit}`
            : "দামের তুলনামূলক তথ্য"}
          {change.pct != null && (
            <span
              className={
                change.dir === "up" ? "price-change-up" : "price-change-down"
              }
            >
              {" "}
              ({change.dir === "up" ? "+" : "-"}
              {change.pct}%)
            </span>
          )}
        </p>

        {slug != null && (
          <Link
            className="product-link"
            href={`/product/${encodeURIComponent(String(slug))}`}
          >
            বিস্তারিত দেখুন →
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function HomePage() {
  let categories = [];
  let products = [];
  let apiError = false;

  try {
    const [categoryData, productData] = await Promise.all([
      getApiData("/categories"),
      getApiData("/products"),
    ]);

    categories = getArray(categoryData);
    products = getArray(productData);
  } catch (error) {
    console.error("Bazar Dor API error:", error);
    apiError = true;
  }

  const risingProducts = products.filter(
    (product) => product.change?.dir === "up"
  );

  const fallingProducts = products.filter(
    (product) => product.change?.dir === "down"
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">আপনার দৈনন্দিন বাজারের সঙ্গী</span>
          <h1>
            বাজারের সঠিক দাম জানুন,
            <br />
            <span>সাশ্রয়ী বাজার করুন</span>
          </h1>
          <p>
            নিত্যপ্রয়োজনীয় পণ্যের দাম, আগের দামের তুলনা এবং বিভিন্ন বাজারের
            মূল্য এক জায়গায় দেখে পরিকল্পনা করে বাজার করুন।
          </p>

          <div className="hero-actions">
            <Link href="#products" className="btn-primary">
              পণ্যের দাম দেখুন
            </Link>
            <Link href="#categories" className="btn-secondary">
              ক্যাটাগরি দেখুন
            </Link>
          </div>

          <div className="hero-note">
            <span>✓</span> সহজে দাম যাচাই করুন
            <span>✓</span> পরিকল্পনা করে বাজার করুন
          </div>
        </div>

        <div className="hero-visual">
          <div className="market-circle">
            <div className="basket">
              <span>🛒</span>
            </div>
            <div className="floating-item item-one">🥦</div>
            <div className="floating-item item-two">🍎</div>
            <div className="floating-item item-three">🍚</div>
            <div className="floating-item item-four">🐟</div>
            <div className="price-tag">
              <span>বাজার করুন পরিকল্পনা করে</span>
              <strong>দাম যাচাই করুন</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <strong>{categories.length}</strong>
          <span>ক্যাটাগরি</span>
        </div>
        <div>
          <strong>{products.length}</strong>
          <span>পণ্য</span>
        </div>
        <div>
          <strong>{products.filter((product) => Array.isArray(product.markets)).length}</strong>
          <span>বাজারের তথ্যসহ পণ্য</span>
        </div>
      </section>

      {apiError && (
        <section className="section">
          <h2>তথ্য লোড করা যায়নি</h2>
          <p>
            API থেকে তথ্য আনতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ ও API ঠিকানা
            পরীক্ষা করে আবার চেষ্টা করুন।
          </p>
        </section>
      )}

      <section className="section" id="categories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ক্যাটাগরি অনুযায়ী</span>
            <h2>বাজারের পণ্য খুঁজুন</h2>
            <p>আপনার প্রয়োজনীয় পণ্যের ক্যাটাগরি বেছে নিন।</p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category, index) => {
              const slug = getCategorySlug(category);
              const icons = ["🌾", "🥦", "🍎", "🐟", "🥚", "🫙"];

              return (
                <Link
                  className="category-card"
                  href={`/category/${encodeURIComponent(slug)}`}
                  key={slug || index}
                >
                  <div
                    className="category-icon"
                    style={{
                      background: [
                        "#e8f5e9",
                        "#e0f2f1",
                        "#fff3e0",
                        "#e3f2fd",
                        "#fce4ec",
                        "#f3e5f5",
                      ][index % 6],
                    }}
                  >
                    {category.icon ?? category.categoryIcon ?? icons[index % icons.length]}
                  </div>
                  <h3>{getCategoryName(category)}</h3>
                  <span>পণ্য দেখুন →</span>
                </Link>
              );
            })}
          </div>
        ) : (
          !apiError && <p>কোনো ক্যাটাগরি পাওয়া যায়নি।</p>
        )}
      </section>

      <section className="section products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">আজকের বাজার</span>
            <h2>সব পণ্যের দাম</h2>
            <p>API-তে থাকা পণ্যের বর্তমান দাম ও তুলনামূলক তথ্য দেখুন।</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                product={product}
                key={product.slug ?? product.id ?? index}
              />
            ))}
          </div>
        ) : (
          !apiError && <p>কোনো পণ্যের তথ্য পাওয়া যায়নি।</p>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">দামের পরিবর্তন</span>
            <h2>দাম বাড়ছে ও কমছে</h2>
            <p>API-এর দেওয়া পরিবর্তনের তথ্য অনুযায়ী পণ্যগুলো দেখুন।</p>
          </div>
        </div>

        <h3>দাম বেড়েছে</h3>
        {risingProducts.length > 0 ? (
          <div className="product-grid">
            {risingProducts.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.slug ?? product.id ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p>দাম বেড়েছে এমন পণ্যের তথ্য নেই।</p>
        )}

        <h3 style={{ marginTop: 32 }}>দাম কমেছে</h3>
        {fallingProducts.length > 0 ? (
          <div className="product-grid">
            {fallingProducts.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.slug ?? product.id ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p>দাম কমেছে এমন পণ্যের তথ্য নেই।</p>
        )}
      </section>

      <section className="saving-banner">
        <div>
          <h2>পরিকল্পনা করে বাজার করুন</h2>
          <p>
            বাজারে যাওয়ার আগে পণ্যের দাম যাচাই করুন এবং নিজের বাজেট অনুযায়ী
            কেনাকাটার পরিকল্পনা করুন।
          </p>
        </div>
        <Link href="#products" className="btn-primary">
          দাম যাচাই করুন
        </Link>
      </section>
    </main>
  );
}