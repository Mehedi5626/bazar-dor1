import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

async function getProducts() {
  const response = await fetch(`${API_BASE}/products`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const result = await response.json();

  if (result.success === false) {
    throw new Error(result.message || "পণ্যের তথ্য লোড করা যায়নি।");
  }

  const data = result.data ?? result.products ?? result;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.products)) return data.products;
  if (Array.isArray(data.items)) return data.items;

  return [];
}

function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) return "তথ্য নেই";

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

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let products;

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Product API error:", error);

    return (
      <main className="detail-page">
        <h1>পণ্যের তথ্য লোড করা যায়নি</h1>
        <p>API থেকে তথ্য আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।</p>
        <Link href="/" className="back-link">
          ← হোমপেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const product = products.find(
    (item) =>
      String(item.slug) === String(decodedSlug) ||
      String(item.id) === String(decodedSlug) ||
      String(item._id) === String(decodedSlug)
  );

  if (!product) {
    notFound();
  }

  const name = product.nameBn ?? product.name ?? "পণ্যের নাম নেই";
  const unit = getUnit(product.unit);
  const markets = Array.isArray(product.markets) ? product.markets : [];
  const change = product.change ?? {};
  const hasChange = change.pct != null && Number.isFinite(Number(change.pct));

  const history = [
    { label: "আজকের দাম", value: product.today },
    { label: "গতকালের দাম", value: product.yesterday },
    { label: "গত সপ্তাহের দাম", value: product.lastWeek },
    { label: "গত মাসের দাম", value: product.lastMonth },
  ];

  return (
    <main className="detail-page">
      <nav style={{ marginBottom: 24, color: "var(--muted)", fontSize: 14 }}>
        <Link href="/" style={{ color: "var(--green)" }}>
          হোম
        </Link>
        {" / "}
        <span>{name}</span>
      </nav>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 28,
          padding: 28,
          border: "1px solid var(--border)",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 130,
            height: 130,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            background: "var(--light-green)",
            fontSize: 64,
          }}
        >
          {product.image ?? product.categoryIcon ?? "🛒"}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ color: "var(--muted)" }}>
            {product.categoryNameBn ?? product.category ?? "অন্যান্য"}
          </p>

          <h1 style={{ marginBottom: 8 }}>{name}</h1>
          <p>প্রতি {unit}</p>

          <p style={{ color: "var(--green)", fontSize: 30, fontWeight: 800 }}>
            {product.today != null
              ? `৳${formatPrice(product.today)}`
              : "দাম পাওয়া যায়নি"}
            {product.today != null && (
              <span style={{ fontSize: 15, fontWeight: 400 }}> / {unit}</span>
            )}
          </p>

          {hasChange && (
            <p
              style={{
                fontWeight: 700,
                color: change.dir === "up" ? "#c62828" : "#16804a",
              }}
            >
              {change.dir === "up" ? "দাম বেড়েছে" : "দাম কমেছে"}{" "}
              {formatPrice(change.pct)}%
            </p>
          )}
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <h2>দামের ইতিহাস</h2>

        <div className="product-grid" style={{ marginTop: 18 }}>
          {history.map((item) => (
            <article
              key={item.label}
              className="product-card"
              style={{ padding: 20 }}
            >
              <p style={{ color: "var(--muted)" }}>{item.label}</p>
              <strong style={{ color: "var(--green)", fontSize: 24 }}>
                {item.value != null
                  ? `৳${formatPrice(item.value)}`
                  : "তথ্য নেই"}
              </strong>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>
                প্রতি {unit}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <h2>বিভিন্ন বাজারে দাম</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
          বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের তুলনা করুন।
        </p>

        {markets.length === 0 ? (
          <p>এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "var(--light-green)" }}>
                <tr>
                  {["বাজার", "বিভাগ", "সর্বনিম্ন দাম", "সর্বোচ্চ দাম"].map(
                    (heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: 14,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market ?? "market"}-${index}`}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: 14, whiteSpace: "nowrap" }}>
                      {market.market ?? "বাজারের নাম নেই"}
                    </td>
                    <td style={{ padding: 14 }}>
                      {market.division ?? "উল্লেখ নেই"}
                    </td>
                    <td style={{ padding: 14, color: "var(--green)" }}>
                      {market.min != null
                        ? `৳${formatPrice(market.min)}`
                        : "তথ্য নেই"}
                    </td>
                    <td style={{ padding: 14, color: "#c62828" }}>
                      {market.max != null
                        ? `৳${formatPrice(market.max)}`
                        : "তথ্য নেই"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div style={{ marginTop: 32 }}>
        <Link href="/" className="btn-primary">
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}