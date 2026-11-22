const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi EJS sebagai View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware untuk membaca data form & file statis (CSS, JS, Gambar)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Data dinamis koperasi (mudah diubah dari satu tempat)
const koperasiData = {
  nama: "KSPPS Tunas Artha Mandiri Syari'ah",
  singkatan: "TAM Syari'ah",
  cabang: "KCP KAB. CIREBON 2",
  whatsapp: "6285318810005", // Ganti dengan nomor resmi admin koperasi
  telepon: "628531881000",
  email: "info@tunasarthasyariah.co.id",
  alamat:
    "Depan SMPN 1, Jl.Pangeran Antasari, Blok Pakuwon, Plumbon, Kec. Plumbon, Kabupaten Cirebon, Jawa Barat 45155",
  jamOperasional: "Senin - Jumat: 08.00 - 16.00 WIB",
  mapsLink: "https://maps.app.goo.gl/YqSz2cSbLn1SrT2d7",
  marginMurabahah: 0.02, // Margin 2% per bulan
  nisbahMudharabah: 0.02, // Estimasi bagi hasil 2% per bulan
};

// Route Halaman Utama
app.get("/", (req, res) => {
  res.render("index", {
    title: `Beranda | ${koperasiData.nama}`,
    info: koperasiData,
  });
});

// Route API (Opsional: jika nanti ingin menyimpan pendaftaran ke MySQL)
app.post("/api/daftar-anggota", (req, res) => {
  const { nama, telepon, jenisLayanan, plafon, pesan } = req.body;
  console.log("Calon Anggota Baru:", {
    nama,
    telepon,
    jenisLayanan,
    plafon,
    pesan,
  });

  res.json({
    status: "success",
    message: "Data pengajuan berhasil diterima sistem.",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
