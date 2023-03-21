// var deepl_token = prompt("請輸入deepl token:");
// var google_token = prompt("請輸入google token:");

const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener("change", function () {
  const ori_content = input.value;
  let content = ori_content.replace(/-\n/g, "");
  content = content.replace(/\n/g, " ");
  console.log(JSON.stringify({ content }));
  console.log("Call API...");
  output.innerHTML = "翻譯文字處理中......";
  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })
    .then((response) => {
      console.log("Response:", response);
      return response.json();
    })
    .then((data) => {
      // 在瀏覽器控制台中顯示從 Node.js 返回的數據
      console.log("Reveive from backend");
      output.innerHTML = data["message"];
    })
    .catch((error) => {
      console.error("error:", error);
    });
});
