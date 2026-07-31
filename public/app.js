async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const result = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(result?.error || "通信に失敗しました。");
  }

  return result;
}

function setFeedback(node, message) {
  if (node) {
    node.textContent = message;
  }
}

async function submitJsonForm(form, url, feedbackNode, method = "POST") {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  await requestJson(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  setFeedback(feedbackNode, "保存しました。画面を更新します。");
  window.setTimeout(() => window.location.reload(), 700);
}

function listingCardTemplate(listing) {
  return `
    <article class="listing-card">
      <div class="listing-top">
        <span class="status ${String(listing.status).toLowerCase()}">${listing.status}</span>
        <strong>¥${listing.price.toLocaleString("ja-JP")}</strong>
      </div>
      <h3><a href="/listings/${listing.id}">${listing.title}</a></h3>
      <p>${listing.courseName} / ${listing.instructorName}</p>
      <p>${listing.description}</p>
      <dl>
        <div><dt>状態</dt><dd>${listing.condition}</dd></div>
        <div><dt>書込</dt><dd>${listing.markingType}</dd></div>
        <div><dt>出品者</dt><dd>${listing.sellerName}（${listing.seller.faculty}）</dd></div>
        <div><dt>受渡</dt><dd>${listing.meetingPlace}</dd></div>
        <div><dt>キャンパス</dt><dd>${listing.campus}</dd></div>
        <div><dt>必須度</dt><dd>${listing.requiredLevel}/5</dd></div>
      </dl>
      <div class="card-actions">
        <a class="button-link" href="/listings/${listing.id}">詳細を見る</a>
        ${listing.status !== "COMPLETED" ? `<button type="button" data-sold-button data-id="${listing.id}">売却済みにする</button>` : ""}
      </div>
    </article>
  `;
}

function renderListings(listings) {
  const container = document.querySelector("#listing-results");
  if (!container) {
    return;
  }

  if (listings.length === 0) {
    container.innerHTML = "<p class=\"feedback\">一致する出品はありません。</p>";
    return;
  }

  container.innerHTML = listings.map(listingCardTemplate).join("");
}

async function markAsSold(id) {
  await requestJson(`/api/listings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "COMPLETED" }),
  });
  window.location.reload();
}

async function deleteListing(id) {
  const response = await fetch(`/api/listings/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("削除に失敗しました。");
  }
}

document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const soldButton = target.closest("[data-sold-button]");
  if (soldButton instanceof HTMLElement) {
    try {
      await markAsSold(soldButton.dataset.id);
    } catch (error) {
      window.alert(error.message);
    }
  }

  const deleteButton = target.closest("[data-delete-button]");
  if (deleteButton instanceof HTMLElement) {
    if (!window.confirm("この出品を削除しますか？")) {
      return;
    }

    try {
      await deleteListing(deleteButton.dataset.id);
      window.location.href = "/";
    } catch (error) {
      setFeedback(document.querySelector("#detail-feedback"), error.message);
    }
  }
});

const listingForm = document.querySelector("#listing-form");
const userForm = document.querySelector("#user-form");
const searchForm = document.querySelector("#search-form");
const editListingForm = document.querySelector("#edit-listing-form");
const transactionForm = document.querySelector("#transaction-form");

if (listingForm instanceof HTMLFormElement) {
  listingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await submitJsonForm(listingForm, "/api/listings", document.querySelector("#listing-feedback"));
    } catch (error) {
      setFeedback(document.querySelector("#listing-feedback"), error.message);
    }
  });
}

if (userForm instanceof HTMLFormElement) {
  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await submitJsonForm(userForm, "/api/users", document.querySelector("#user-feedback"));
    } catch (error) {
      setFeedback(document.querySelector("#user-feedback"), error.message);
    }
  });
}

if (searchForm instanceof HTMLFormElement) {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const params = new URLSearchParams(new FormData(searchForm));
      const listings = await requestJson(`/api/listings?${params.toString()}`);
      renderListings(listings);
    } catch (error) {
      setFeedback(document.querySelector("#listing-feedback"), error.message);
    }
  });
}

if (editListingForm instanceof HTMLFormElement) {
  editListingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const listingId = editListingForm.dataset.listingId;
    try {
      await submitJsonForm(editListingForm, `/api/listings/${listingId}`, document.querySelector("#detail-feedback"), "PUT");
    } catch (error) {
      setFeedback(document.querySelector("#detail-feedback"), error.message);
    }
  });
}

if (transactionForm instanceof HTMLFormElement) {
  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const listingId = transactionForm.dataset.listingId;
    const formData = new FormData(transactionForm);
    const payload = Object.fromEntries(formData.entries());
    payload.listingId = listingId;

    try {
      await requestJson("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setFeedback(document.querySelector("#transaction-feedback"), "購入希望を送信しました。");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setFeedback(document.querySelector("#transaction-feedback"), error.message);
    }
  });
}
