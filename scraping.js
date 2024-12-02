// import axios from "axios";
// import cheerio from "cheerio";

// async function scrapeTopHolders(url) {
//   try {
//     // Ambil halaman HTML menggunakan Axios
//     const { data: html } = await axios.get(url);

//     console.log(html, "html")

//     // Load HTML ke Cheerio untuk parsing
//     const $ = cheerio.load(html);

//     // Selector untuk mendapatkan data wallet address dari tabel holders
//     const holdersTableRows = $(".table tbody tr"); // Ubah sesuai struktur tabel di website

//     const topHolders = [];
//     holdersTableRows.each((index, element) => {
//       // Ambil address dari kolom tabel
//       const address = $(element).find("td:nth-child(2)").text().trim();

//       // Hanya ambil 5 alamat teratas
//       if (index < 5) {
//         topHolders.push(address);
//       }
//     });

//     console.log("Top 5 Wallet Addresses:", topHolders);
//     return topHolders;
//   } catch (error) {
//     console.error("Error scraping data:", error);
//   }
// }

// // URL halaman holders (ganti dengan URL BaseScan yang sesuai)
// const url =
//   "https://basescan.org/token/0x3992b27d2a26848c2b19cea6fd25ad5568b68ab98#balances";
// scrapeTopHolders(url);

import puppeteer from "puppeteer";

async function scrapeTopHolders(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Buka URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Tunggu hingga tabel data muncul
    await page.waitForSelector(".table tbody");

    // Scraping data menggunakan evaluasi langsung di DOM
    const topHolders = await page.evaluate(() => {
      const rows = document.querySelectorAll(".table tbody tr"); // Selector untuk tabel
      const holders = [];

      rows.forEach((row, index) => {
        if (index < 5) {
          // Ambil text dari kolom alamat wallet (kolom ke-2)
          const address = row
            .querySelector("td:nth-child(2)")
            ?.innerText.trim();
          if (address) {
            holders.push(address);
          }
        }
      });

      return holders;
    });

    console.log("Top 5 Wallet Addresses:", topHolders);
    return topHolders;
  } catch (error) {
    console.error("Error scraping data:", error.message);
  } finally {
    await browser.close();
  }
}

// URL halaman holders (ganti dengan URL BaseScan yang sesuai)
const url =
  "https://basescan.org/token/0x3992b27d2a26848c2b19cea6fd25ad5568b68ab98#balances";
scrapeTopHolders(url);
