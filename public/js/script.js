document.addEventListener("DOMContentLoaded", () => {
  // 1. Toggle Mobile Menu
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // 2. Tab Katalog Produk (Simpanan vs Pembiayaan)
  const tabSimpanan = document.getElementById("tab-simpanan");
  const tabPembiayaan = document.getElementById("tab-pembiayaan");
  const contentSimpanan = document.getElementById("content-simpanan");
  const contentPembiayaan = document.getElementById("content-pembiayaan");

  if (tabSimpanan && tabPembiayaan) {
    tabSimpanan.addEventListener("click", () => {
      tabSimpanan.className =
        "px-6 py-2.5 rounded-full font-semibold text-sm bg-emerald-800 text-white shadow transition";
      tabPembiayaan.className =
        "px-6 py-2.5 rounded-full font-semibold text-sm text-emerald-900 hover:bg-emerald-50 transition";
      contentSimpanan.classList.remove("hidden");
      contentPembiayaan.classList.add("hidden");
    });

    tabPembiayaan.addEventListener("click", () => {
      tabPembiayaan.className =
        "px-6 py-2.5 rounded-full font-semibold text-sm bg-emerald-800 text-white shadow transition";
      tabSimpanan.className =
        "px-6 py-2.5 rounded-full font-semibold text-sm text-emerald-900 hover:bg-emerald-50 transition";
      contentPembiayaan.classList.remove("hidden");
      contentSimpanan.classList.add("hidden");
    });
  }

  // 3. Kalkulator Simulasi Pembiayaan Syariah (Aturan Bulanan & Mingguan)
  const btnSkemaBulanan = document.getElementById("btn-skema-bulanan");
  const btnSkemaMingguan = document.getElementById("btn-skema-mingguan");
  const skemaInput = document.getElementById("skema-pembayaran");
  const tenorLabel = document.getElementById("tenor-label");
  const tenorSelect = document.getElementById("tenor-select");
  const tenorNote = document.getElementById("tenor-note");

  const plafonRange = document.getElementById("plafon-range");
  const plafonDisplay = document.getElementById("plafon-display");
  const plafonMinLabel = document.getElementById("plafon-min-label");
  const plafonMaxLabel = document.getElementById("plafon-max-label");

  const akadSelect = document.getElementById("akad-select");
  const angsuranSubtitle = document.getElementById("angsuran-subtitle");
  const angsuranDisplay = document.getElementById("angsuran-display");
  const keteranganSkema = document.getElementById("keterangan-skema");
  const btnAjukanSimulasi = document.getElementById("btn-ajukan-simulasi");

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const perbaruiOpsiTenor = () => {
    if (!tenorSelect || !plafonRange) return;
    const skema = skemaInput.value;
    const plafon = parseInt(plafonRange.value);
    const nilaiSebelumnya = parseInt(tenorSelect.value);

    let daftarTenor = [];

    if (skema === "bulanan") {
      if (plafon <= 10000000) {
        daftarTenor = [
          { value: 6, label: "6 Bulan (6x Angsuran)" },
          { value: 12, label: "12 Bulan (12x Angsuran)" },
        ];
        if (tenorNote) {
          tenorNote.textContent =
            "*Plafon Rp 10 Juta ke bawah maksimal tenor 12 bulan.";
        }
      } else {
        daftarTenor = [
          { value: 6, label: "6 Bulan (6x Angsuran)" },
          { value: 12, label: "12 Bulan (12x Angsuran)" },
          { value: 24, label: "24 Bulan (24x Angsuran)" },
          { value: 36, label: "36 Bulan (36x Angsuran)" },
        ];
        if (tenorNote) {
          tenorNote.textContent =
            "*Plafon di atas Rp 10 Juta tersedia tenor hingga 36 bulan.";
        }
      }
    } else {
      // Skema Mingguan: Patokan 10 Minggu (dan opsi 20 Minggu)
      daftarTenor = [
        { value: 10, label: "10 Minggu (10x Angsuran)" },
        { value: 20, label: "20 Minggu (20x Angsuran)" },
      ];
      if (tenorNote) {
        tenorNote.textContent =
          "*Skema mingguan standar 10 minggu (Rp 114.000/mgg per Rp 1 Juta).";
      }
    }

    tenorSelect.innerHTML = "";
    daftarTenor.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.value;
      opt.textContent = item.label;
      tenorSelect.appendChild(opt);
    });

    const masihTersedia = daftarTenor.some((t) => t.value === nilaiSebelumnya);
    if (masihTersedia) {
      tenorSelect.value = nilaiSebelumnya;
    } else {
      // Default ke pilihan pertama untuk mingguan (10 Minggu), atau terakhir untuk bulanan
      tenorSelect.value =
        skema === "mingguan"
          ? daftarTenor[0].value
          : daftarTenor[daftarTenor.length - 1].value;
    }
  };

  const hitungSimulasi = () => {
    if (!plafonRange) return;
    const skema = skemaInput.value;
    const plafon = parseInt(plafonRange.value);
    const jumlahAngsuran = parseInt(tenorSelect.value);
    const rateBulanan = parseFloat(akadSelect.value);

    plafonDisplay.textContent = formatRupiah(plafon);

    if (skema === "bulanan") {
      const pokokPerBulan = plafon / jumlahAngsuran;
      const marginPerBulan = plafon * rateBulanan;
      const totalAngsuran = Math.round(pokokPerBulan + marginPerBulan);

      angsuranSubtitle.textContent = `Estimasi Angsuran Bulanan (${jumlahAngsuran}x Bayar)`;
      angsuranDisplay.textContent = `${formatRupiah(totalAngsuran)} / bln`;
      keteranganSkema.textContent = "Margin 2% per bulan • Jatuh tempo bulanan";
    } else {
      // Mingguan: Patokan Rp 1.000.000 dengan tenor 10 minggu -> Rp 114.000 / minggu
      // Total pengembalian Rp 1.140.000 (Pokok Rp 100.000 + Margin Rp 14.000 per minggu)
      const kelipatanSejuta = plafon / 1000000;
      const pokokPerMinggu = plafon / jumlahAngsuran;
      const marginPerMinggu = kelipatanSejuta * 14000;
      const angsuranMingguan = Math.round(pokokPerMinggu + marginPerMinggu);

      angsuranSubtitle.textContent = `Estimasi Angsuran Mingguan (${jumlahAngsuran}x Bayar)`;
      angsuranDisplay.textContent = `${formatRupiah(angsuranMingguan)} / mgg`;
      keteranganSkema.textContent =
        "Angsuran ringan mingguan (layanan jemput setoran)";
    }
  };

  const aturModeSkema = (skema) => {
    skemaInput.value = skema;
    if (skema === "bulanan") {
      btnSkemaBulanan.className =
        "py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 text-emerald-950 shadow transition";
      btnSkemaMingguan.className =
        "py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white transition";
      tenorLabel.textContent = "Jangka Waktu (Bulan)";

      // Atur rentang plafon Bulanan: Min 3 Juta - Maks 100 Juta
      plafonRange.min = 3000000;
      plafonRange.max = 100000000;
      plafonRange.step = 1000000;
      if (parseInt(plafonRange.value) < 3000000) {
        plafonRange.value = 3000000;
      }
      plafonMinLabel.textContent = "Min. Rp 3 Juta";
      plafonMaxLabel.textContent = "Maks. Rp 100 Juta";
    } else {
      btnSkemaMingguan.className =
        "py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 text-emerald-950 shadow transition";
      btnSkemaBulanan.className =
        "py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white transition";
      tenorLabel.textContent = "Jangka Waktu (Minggu)";

      // Atur rentang plafon Mingguan: Min 1 Juta - Maks 10 Juta
      plafonRange.min = 1000000;
      plafonRange.max = 10000000;
      plafonRange.step = 500000;
      plafonRange.value = 1000000; // Default ke Rp 1 Juta (Rp 114.000/minggu)
      plafonMinLabel.textContent = "Min. Rp 1 Juta";
      plafonMaxLabel.textContent = "Maks. Rp 10 Juta";
    }

    perbaruiOpsiTenor();
    hitungSimulasi();
  };

  if (btnSkemaBulanan && btnSkemaMingguan) {
    btnSkemaBulanan.addEventListener("click", () => aturModeSkema("bulanan"));
    btnSkemaMingguan.addEventListener("click", () => aturModeSkema("mingguan"));
  }

  if (plafonRange) {
    plafonRange.addEventListener("input", () => {
      perbaruiOpsiTenor();
      hitungSimulasi();
    });
    tenorSelect.addEventListener("change", hitungSimulasi);
    akadSelect.addEventListener("change", hitungSimulasi);
    aturModeSkema("bulanan"); // Inisialisasi awal
  }

  // Transfer hasil simulasi ke Form Pendaftaran
  if (btnAjukanSimulasi) {
    btnAjukanSimulasi.addEventListener("click", () => {
      const skemaText =
        skemaInput.value === "bulanan" ? "Bayar Bulanan" : "Bayar Mingguan";
      const plafonText = plafonDisplay.textContent;
      const tenorText = tenorSelect.options[tenorSelect.selectedIndex].text;
      const akadText = akadSelect.options[akadSelect.selectedIndex].text;
      const estimasiText = angsuranDisplay.textContent;

      document.getElementById("form-layanan").value = "Pembiayaan Syariah";
      document.getElementById("form-pesan").value =
        `Saya tertarik mengajukan pembiayaan sebesar ${plafonText} dengan skema ${skemaText}, tenor ${tenorText} (${akadText}), estimasi angsuran ${estimasiText}.`;
      document.getElementById("daftar").scrollIntoView({ behavior: "smooth" });
    });
  }

  // 4. Form Pendaftaran Anggota -> Kirim ke Backend & Buka WhatsApp
  const formPendaftaran = document.getElementById("form-pendaftaran");
  if (formPendaftaran) {
    formPendaftaran.addEventListener("submit", async (e) => {
      e.preventDefault();

      const waAdmin = formPendaftaran.dataset.whatsapp;
      const nama = document.getElementById("form-nama").value.trim();
      const telepon = document.getElementById("form-telepon").value.trim();
      const layanan = document.getElementById("form-layanan").value;
      const pesan = document.getElementById("form-pesan").value.trim();

      try {
        await fetch("/api/daftar-anggota", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama, telepon, jenisLayanan: layanan, pesan }),
        });
      } catch (err) {
        console.warn(
          "Gagal mencatat ke log server, melanjutkan ke WhatsApp:",
          err,
        );
      }

      const teksWA = `Assalamu'alaikum Admin KSPPS Tunas Artha Mandiri Syari'ah.%0A%0ASaya ingin mendaftar / berkonsultasi:%0A*Nama:* ${encodeURIComponent(nama)}%0A*No. HP/WA:* ${encodeURIComponent(telepon)}%0A*Layanan:* ${encodeURIComponent(layanan)}%0A*Keterangan:* ${encodeURIComponent(pesan || "-")}`;

      window.open(`https://wa.me/${waAdmin}?text=${teksWA}`, "_blank");
    });
  }

  // 5. Accordion FAQ
  const faqButtons = document.querySelectorAll(".faq-btn");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector("i");
      answer.classList.toggle("hidden");
      icon.classList.toggle("rotate-180");
    });
  });

  // 6. Modal Tabel Rincian Jadwal Angsuran
  const btnLihatTabel = document.getElementById("btn-lihat-tabel");
  const modalRincian = document.getElementById("modal-rincian");
  const btnTutupModal = document.getElementById("btn-tutup-modal");
  const btnTutupModalBawah = document.getElementById("btn-tutup-modal-bawah");
  const btnAjukanDariModal = document.getElementById("btn-ajukan-dari-modal");
  const tabelRincianBody = document.getElementById("tabel-rincian-body");
  const modalRingkasan = document.getElementById("modal-ringkasan");

  const bukaModalRincian = () => {
    if (!modalRincian || !plafonRange) return;
    const skema = skemaInput.value;
    const plafon = parseInt(plafonRange.value);
    const jumlahAngsuran = parseInt(tenorSelect.value);
    const rateBulanan = parseFloat(akadSelect.value);

    let pokokPerTermin = 0;
    let marginPerTermin = 0;
    let totalPerTermin = 0;
    const satuanWaktu = skema === "bulanan" ? "Bulan" : "Minggu";

    if (skema === "bulanan") {
      pokokPerTermin = Math.round(plafon / jumlahAngsuran);
      marginPerTermin = Math.round(plafon * rateBulanan);
      totalPerTermin = pokokPerTermin + marginPerTermin;
    } else {
      // Diselaraskan dengan patokan 10 minggu: Rp 114.000/mgg per Rp 1 Juta
      const kelipatanSejuta = plafon / 1000000;
      pokokPerTermin = Math.round(plafon / jumlahAngsuran);
      marginPerTermin = Math.round(kelipatanSejuta * 14000);
      totalPerTermin = pokokPerTermin + marginPerTermin;
    }

    modalRingkasan.textContent = `Plafon ${formatRupiah(plafon)} • ${jumlahAngsuran} ${satuanWaktu} (${skema === "bulanan" ? "Bayar Bulanan" : "Bayar Mingguan"})`;
    tabelRincianBody.innerHTML = "";

    let sisaPokok = plafon;
    for (let i = 1; i <= jumlahAngsuran; i++) {
      sisaPokok = Math.max(0, sisaPokok - pokokPerTermin);
      if (i === jumlahAngsuran) sisaPokok = 0; // Pastikan termin terakhir lunas 0

      const tr = document.createElement("tr");
      tr.className = i % 2 === 0 ? "bg-slate-50/60" : "bg-white";
      tr.innerHTML = `
        <td class="py-2.5 px-4 font-semibold">${satuanWaktu} ke-${i}</td>
        <td class="py-2.5 px-4">${formatRupiah(pokokPerTermin)}</td>
        <td class="py-2.5 px-4 text-emerald-700">${formatRupiah(marginPerTermin)}</td>
        <td class="py-2.5 px-4 font-bold text-slate-900">${formatRupiah(totalPerTermin)}</td>
        <td class="py-2.5 px-4 text-slate-500">${formatRupiah(sisaPokok)}</td>
      `;
      tabelRincianBody.appendChild(tr);
    }

    modalRincian.classList.remove("hidden");
  };

  if (btnLihatTabel) {
    btnLihatTabel.addEventListener("click", bukaModalRincian);
  }
  if (btnTutupModal) {
    btnTutupModal.addEventListener("click", () =>
      modalRincian.classList.add("hidden"),
    );
  }
  if (btnTutupModalBawah) {
    btnTutupModalBawah.addEventListener("click", () =>
      modalRincian.classList.add("hidden"),
    );
  }
  if (btnAjukanDariModal) {
    btnAjukanDariModal.addEventListener("click", () => {
      modalRincian.classList.add("hidden");
      if (btnAjukanSimulasi) btnAjukanSimulasi.click();
    });
  }
  // 7. Kuis Rekomendasi Pembiayaan Otomatis
  const kuisTujuan = document.getElementById("kuis-tujuan");
  const kuisPenghasilan = document.getElementById("kuis-penghasilan");
  const kuisNominal = document.getElementById("kuis-nominal");
  const kuisHasilJudul = document.getElementById("kuis-hasil-judul");
  const kuisHasilDeskripsi = document.getElementById("kuis-hasil-deskripsi");
  const btnTerapkanRekomendasi = document.getElementById(
    "btn-terapkan-rekomendasi",
  );

  let rekomendasiSkema = "mingguan";
  let rekomendasiPlafon = 1000000;

  const perbaruiRekomendasi = () => {
    if (!kuisTujuan || !kuisPenghasilan || !kuisNominal) return;

    const tujuan = kuisTujuan.value;
    const penghasilan = kuisPenghasilan.value;
    const nominal = kuisNominal.value;

    // Tentukan nama akad berdasarkan tujuan dana
    let namaAkad = "Pembiayaan Modal Kerja (Akad Mudharabah)";
    if (tujuan === "alat_usaha") {
      namaAkad = "Pembiayaan Pengadaan Barang (Akad Murabahah)";
    } else if (tujuan === "kebutuhan_keluarga") {
      namaAkad = "Pembiayaan Multijasa (Akad Ijarah)";
    }

    // Tentukan skema bayar & plafon berdasarkan penghasilan & nominal
    if (
      nominal === "kecil" ||
      (penghasilan === "harian" && nominal !== "besar")
    ) {
      rekomendasiSkema = "mingguan";
      rekomendasiPlafon = nominal === "kecil" ? 1000000 : 3000000;
      kuisHasilJudul.textContent = `${namaAkad} • Bayar Mingguan`;
      kuisHasilDeskripsi.textContent =
        "Angsuran ringan setiap minggu (mulai Rp 114.000/mgg per Rp 1 Juta untuk 10 minggu) dengan layanan jemput setoran ke tempat usaha.";
    } else {
      rekomendasiSkema = "bulanan";
      rekomendasiPlafon = nominal === "menengah" ? 5000000 : 15000000;
      const infoTenor =
        nominal === "menengah"
          ? "tenor s/d 12 bulan"
          : "tenor fleksibel s/d 36 bulan";
      kuisHasilJudul.textContent = `${namaAkad} • Bayar Bulanan`;
      kuisHasilDeskripsi.textContent = `Margin ringan 2% per bulan dengan angsuran tetap (${infoTenor}), sesuai jadwal gajian/pendapatan bulanan Anda.`;
    }
  };

  if (kuisTujuan && kuisPenghasilan && kuisNominal) {
    kuisTujuan.addEventListener("change", perbaruiRekomendasi);
    kuisPenghasilan.addEventListener("change", perbaruiRekomendasi);
    kuisNominal.addEventListener("change", perbaruiRekomendasi);
    perbaruiRekomendasi(); // Jalankan saat halaman pertama kali dibuka
  }

  if (btnTerapkanRekomendasi) {
    btnTerapkanRekomendasi.addEventListener("click", () => {
      // Otomatis atur kalkulator simulasi di bawah sesuai hasil kuis
      aturModeSkema(rekomendasiSkema);
      if (plafonRange) {
        plafonRange.value = rekomendasiPlafon;
        perbaruiOpsiTenor();
        hitungSimulasi();
      }
      document
        .getElementById("simulasi")
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});
