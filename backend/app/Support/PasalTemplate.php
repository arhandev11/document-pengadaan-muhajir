<?php

namespace App\Support;

/**
 * Data template pasal untuk Perjanjian Kerjasama.
 * Verbatim dari Doc Manager.html — lines 289-439 (templateBarang & templateJasa).
 *
 * Setiap pasal memiliki: judul, intro (opsional), poin (array of {text, sub?}).
 */
class PasalTemplate
{
    public static function forTipe(string $tipe): array
    {
        return $tipe === 'jasa' ? self::jasa() : self::barang();
    }

    public static function barang(): array
    {
        return [
            [
                'judul' => 'KETENTUAN UMUM',
                'intro' => 'Istilah-istilah berikut digunakan dalam Perjanjian ini dengan pengertian sebagai berikut:',
                'poin' => [
                    ['text' => '"Perjanjian" berarti Surat Perjanjian Pengadaan Barang ini beserta seluruh lampirannya.'],
                    ['text' => '"Barang" berarti seluruh barang yang wajib diserahkan oleh PIHAK KEDUA sebagaimana dirinci dalam Pasal 3.'],
                    ['text' => '"Harga Perjanjian" berarti nilai total pembayaran sebagaimana tercantum dalam Pasal 6 Perjanjian ini.'],
                    ['text' => '"Hari Kerja" berarti setiap hari selain Sabtu, Minggu, dan hari libur nasional Republik Indonesia.'],
                    ['text' => '"Keadaan Kahar" berarti suatu kejadian di luar kendali para pihak sebagaimana diatur dalam Pasal 10.'],
                ],
            ],
            [
                'judul' => 'RUANG LINGKUP PENGADAAN',
                'intro' => 'PIHAK KEDUA wajib menyediakan dan menyerahkan Barang kepada PIHAK PERTAMA yang meliputi:',
                'poin' => [
                    ['text' => 'Pengadaan barang sesuai spesifikasi teknis yang disepakati.'],
                    ['text' => 'Pengiriman dan penyerahan Barang ke lokasi yang ditentukan oleh PIHAK PERTAMA.'],
                    ['text' => 'Pengemasan Barang yang layak untuk menjaga kualitas selama proses pengiriman.'],
                    ['text' => 'Dokumentasi teknis dan sertifikat keaslian Barang apabila dipersyaratkan.'],
                ],
            ],
            [
                'judul' => 'SPESIFIKASI TEKNIS DAN KUALITAS',
                'intro' => 'Barang yang diadakan wajib memenuhi spesifikasi teknis sebagai berikut:',
                'poin' => [
                    ['text' => 'Barang harus baru, belum pernah digunakan, dan bebas dari cacat produksi.'],
                    ['text' => 'Barang harus sesuai dengan spesifikasi teknis yang tercantum dalam lampiran Perjanjian ini.'],
                    ['text' => 'PIHAK KEDUA wajib menyertakan sertifikat kualitas dan/atau dokumen pendukung lainnya.'],
                    ['text' => 'PIHAK PERTAMA berhak melakukan inspeksi dan pengujian kualitas sebelum menerima Barang.'],
                ],
            ],
            [
                'judul' => 'JANGKA WAKTU PERJANJIAN',
                'intro' => '',
                'poin' => [
                    ['text' => 'Perjanjian ini berlaku efektif sejak tanggal ditandatangani oleh PARA PIHAK.'],
                    ['text' => 'Jangka waktu pelaksanaan pengadaan adalah sebagaimana disepakati dalam lampiran jadwal pengiriman.'],
                    ['text' => 'Perjanjian berakhir setelah seluruh kewajiban PARA PIHAK dipenuhi dan dinyatakan selesai dalam Berita Acara Serah Terima.'],
                ],
            ],
            [
                'judul' => 'KEWAJIBAN PIHAK PERTAMA',
                'intro' => 'PIHAK PERTAMA berkewajiban untuk:',
                'poin' => [
                    ['text' => 'Menyampaikan spesifikasi dan jumlah Barang yang dibutuhkan secara tertulis kepada PIHAK KEDUA.'],
                    ['text' => 'Menyediakan lokasi penerimaan Barang yang telah siap pada waktu yang disepakati.'],
                    ['text' => 'Melakukan pemeriksaan dan penerimaan Barang sesuai prosedur yang ditetapkan.'],
                    ['text' => 'Melakukan pembayaran sesuai ketentuan dalam Pasal 6 Perjanjian ini.'],
                    ['text' => 'Menjaga kerahasiaan informasi yang diperoleh dari PIHAK KEDUA.'],
                ],
            ],
            [
                'judul' => 'KEWAJIBAN PIHAK KEDUA',
                'intro' => 'PIHAK KEDUA berkewajiban untuk:',
                'poin' => [
                    ['text' => 'Menyediakan dan menyerahkan Barang sesuai spesifikasi, jumlah, dan jadwal yang disepakati.'],
                    ['text' => 'Menjamin bahwa Barang yang diserahkan bebas dari cacat mutu dan sesuai dengan standar kualitas.'],
                    ['text' => 'Memberikan garansi atas Barang selama jangka waktu yang disepakati.'],
                    ['text' => 'Menyertakan seluruh dokumen pendukung yang dipersyaratkan pada saat serah terima.'],
                    ['text' => 'Bertanggung jawab atas penggantian Barang yang cacat atau tidak sesuai spesifikasi.'],
                ],
            ],
            [
                'judul' => 'HARGA DAN PEMBAYARAN',
                'intro' => 'PARA PIHAK sepakat atas ketentuan harga dan pembayaran sebagai berikut:',
                'poin' => [
                    ['text' => 'Harga Perjanjian telah mencakup semua biaya pengadaan, pengemasan, pengiriman, dan pajak yang berlaku.'],
                    ['text' => 'Pembayaran dilakukan melalui transfer bank ke rekening yang ditunjuk PIHAK KEDUA.'],
                    ['text' => 'Pembayaran dilaksanakan paling lambat [N] hari kerja setelah Berita Acara Serah Terima ditandatangani.'],
                    ['text' => 'Pajak Pertambahan Nilai (PPN) sebesar 11% telah diperhitungkan dalam Harga Perjanjian.'],
                ],
            ],
            [
                'judul' => 'PENYERAHAN DAN PEMERIKSAAN BARANG',
                'intro' => '',
                'poin' => [
                    ['text' => 'PIHAK KEDUA wajib menyerahkan Barang tepat waktu sesuai jadwal yang disepakati.'],
                    ['text' => 'Pemeriksaan dilakukan oleh PIHAK PERTAMA dalam waktu [N] hari kerja sejak Barang diterima.'],
                    ['text' => 'Apabila ditemukan ketidaksesuaian, PIHAK KEDUA wajib melakukan penggantian dalam waktu [N] hari kerja.'],
                    ['text' => 'Serah terima Barang dinyatakan selesai setelah ditandatanganinya Berita Acara Serah Terima.'],
                ],
            ],
            [
                'judul' => 'GARANSI DAN JAMINAN MUTU',
                'intro' => '',
                'poin' => [
                    ['text' => 'PIHAK KEDUA memberikan garansi atas Barang selama [N] bulan sejak tanggal serah terima.'],
                    ['text' => 'Selama masa garansi, PIHAK KEDUA wajib mengganti Barang yang rusak akibat cacat produksi tanpa biaya tambahan.'],
                    ['text' => 'Garansi tidak berlaku untuk kerusakan akibat kesalahan penggunaan atau kelalaian PIHAK PERTAMA.'],
                ],
            ],
            [
                'judul' => 'KEADAAN KAHAR',
                'intro' => 'Yang dimaksud Keadaan Kahar dalam Perjanjian ini adalah:',
                'poin' => [
                    ['text' => 'Suatu peristiwa yang terjadi di luar kendali para pihak, tidak dapat diramalkan, dan tidak dapat dihindari.'],
                    ['text' => 'Termasuk namun tidak terbatas pada: bencana alam, perang, kerusuhan, wabah penyakit, kebijakan pemerintah yang berdampak langsung.'],
                    ['text' => 'Pihak yang mengalami Keadaan Kahar wajib memberitahukan secara tertulis kepada pihak lainnya dalam waktu 14 hari.'],
                ],
            ],
            [
                'judul' => 'PEMUTUSAN PERJANJIAN',
                'intro' => 'Perjanjian ini dapat diakhiri lebih awal apabila:',
                'poin' => [
                    ['text' => 'Salah satu pihak tidak memenuhi kewajibannya dan tidak memperbaiki kelalaian tersebut dalam 30 hari setelah peringatan tertulis.'],
                    ['text' => 'Salah satu pihak dinyatakan pailit atau dibubarkan berdasarkan ketentuan hukum yang berlaku.'],
                    ['text' => 'Terjadi Keadaan Kahar yang berlangsung lebih dari 6 bulan berturut-turut.'],
                    ['text' => 'Disepakati bersama oleh PARA PIHAK secara tertulis.'],
                ],
            ],
            [
                'judul' => 'PENYELESAIAN SENGKETA',
                'intro' => '',
                'poin' => [
                    ['text' => 'PARA PIHAK berkewajiban menyelesaikan setiap perselisihan secara musyawarah mufakat terlebih dahulu.'],
                    ['text' => 'Apabila tidak tercapai kesepakatan dalam 30 hari, para pihak sepakat untuk menyelesaikan melalui mediasi.'],
                    ['text' => 'Apabila mediasi tidak berhasil, penyelesaian dilakukan melalui Badan Arbitrase Nasional Indonesia (BANI).'],
                ],
            ],
            [
                'judul' => 'KERAHASIAAN DAN PENUTUP',
                'intro' => '',
                'poin' => [
                    ['text' => 'PARA PIHAK sepakat menjaga kerahasiaan seluruh informasi yang diperoleh dalam pelaksanaan Perjanjian ini.'],
                    ['text' => 'Hal-hal yang belum diatur akan diatur kemudian dalam addendum yang merupakan bagian tidak terpisahkan.'],
                    ['text' => 'Perjanjian ini dibuat dalam rangkap 2 (dua) bermaterai cukup dan memiliki kekuatan hukum yang sama.'],
                ],
            ],
        ];
    }

    public static function jasa(): array
    {
        return [
            [
                'judul' => 'OBJEK DAN RUANG LINGKUP PERJANJIAN',
                'intro' => 'Perjanjian ini mencakup kerjasama dalam penyediaan jasa, yang meliputi:',
                'poin' => [
                    ['text' => 'Penyediaan jasa oleh PIHAK KEDUA kepada PIHAK PERTAMA sesuai lingkup yang disepakati.'],
                    ['text' => 'Pelaksanaan seluruh kegiatan operasional yang diperlukan dalam rangka pemenuhan jasa.'],
                    ['text' => 'Pelaporan berkala atas kemajuan dan hasil pelaksanaan jasa kepada PIHAK PERTAMA.'],
                    ['text' => 'Koordinasi teknis dan administratif selama periode pelaksanaan jasa.'],
                ],
            ],
            [
                'judul' => 'JANGKA WAKTU PERJANJIAN',
                'intro' => '',
                'poin' => [
                    ['text' => 'Perjanjian ini berlaku efektif sejak tanggal penandatanganan oleh PARA PIHAK.'],
                    ['text' => 'Jangka waktu pelaksanaan jasa adalah sebagaimana disepakati dalam Lampiran Jadwal Kerja.'],
                    ['text' => 'PARA PIHAK dapat menyepakati perpanjangan jangka waktu melalui addendum tertulis.'],
                ],
            ],
            [
                'judul' => 'KEWAJIBAN PIHAK PERTAMA',
                'intro' => 'PIHAK PERTAMA berkewajiban untuk:',
                'poin' => [
                    ['text' => 'Menyampaikan instruksi, arahan, dan dokumen yang diperlukan kepada PIHAK KEDUA secara tepat waktu.'],
                    ['text' => 'Menyediakan akses, fasilitas, dan sumber daya yang dibutuhkan untuk pelaksanaan jasa.'],
                    ['text' => 'Melakukan evaluasi dan persetujuan atas hasil kerja PIHAK KEDUA sesuai jadwal yang disepakati.'],
                    ['text' => 'Melakukan pembayaran atas jasa yang telah dilaksanakan sesuai ketentuan Perjanjian ini.'],
                ],
            ],
            [
                'judul' => 'KEWAJIBAN PIHAK KEDUA',
                'intro' => 'PIHAK KEDUA berkewajiban untuk:',
                'poin' => [
                    ['text' => 'Melaksanakan jasa dengan standar profesional tertinggi sesuai lingkup yang disepakati.'],
                    ['text' => 'Menyediakan tenaga ahli yang kompeten dan berpengalaman sesuai kebutuhan pekerjaan.'],
                    ['text' => 'Menyampaikan laporan kemajuan pekerjaan secara berkala kepada PIHAK PERTAMA.'],
                    ['text' => 'Mematuhi seluruh peraturan perundang-undangan yang berlaku dalam pelaksanaan jasa.'],
                    ['text' => 'Bertanggung jawab atas seluruh hasil pekerjaan yang diserahkan kepada PIHAK PERTAMA.'],
                ],
            ],
            [
                'judul' => 'STANDAR KUALITAS LAYANAN',
                'intro' => 'PIHAK KEDUA wajib menjamin kualitas layanan sebagai berikut:',
                'poin' => [
                    ['text' => 'Seluruh pekerjaan dilaksanakan sesuai standar industri dan best practice yang berlaku.'],
                    ['text' => 'Capaian kualitas minimum ditetapkan berdasarkan indikator kinerja yang disepakati.'],
                    ['text' => 'PIHAK PERTAMA berhak melakukan evaluasi kualitas secara berkala selama periode jasa.'],
                    ['text' => 'Apabila kualitas tidak memenuhi standar, PIHAK KEDUA wajib melakukan perbaikan tanpa biaya tambahan.'],
                ],
            ],
            [
                'judul' => 'HARGA DAN PEMBAYARAN',
                'intro' => 'PARA PIHAK sepakat atas ketentuan harga dan pembayaran sebagai berikut:',
                'poin' => [
                    ['text' => 'Nilai total Perjanjian ini adalah sebagaimana disepakati dalam Lampiran Rincian Biaya.'],
                    ['text' => 'Pembayaran dilakukan secara termin/bulanan/selesai pekerjaan sesuai kesepakatan PARA PIHAK.'],
                    ['text' => 'Setiap tagihan disertai invoice dan dokumen pendukung yang dipersyaratkan.'],
                    ['text' => 'PIHAK PERTAMA wajib melakukan pembayaran paling lambat [N] hari kerja setelah invoice diterima.'],
                ],
            ],
            [
                'judul' => 'PELAPORAN DAN PENGAWASAN',
                'intro' => '',
                'poin' => [
                    ['text' => 'PIHAK KEDUA wajib menyampaikan laporan kemajuan pekerjaan secara berkala kepada PIHAK PERTAMA.'],
                    ['text' => 'Format, frekuensi, dan mekanisme pelaporan ditetapkan bersama oleh PARA PIHAK.'],
                    ['text' => 'PIHAK PERTAMA berhak melakukan pengawasan dan inspeksi atas pelaksanaan jasa sewaktu-waktu.'],
                ],
            ],
            [
                'judul' => 'PENGALIHAN DAN SUB-KONTRAK',
                'intro' => '',
                'poin' => [
                    ['text' => 'PIHAK KEDUA tidak diperbolehkan mengalihkan seluruh atau sebagian Perjanjian ini tanpa persetujuan tertulis PIHAK PERTAMA.'],
                    ['text' => 'Sub-kontrak sebagian pekerjaan hanya diperbolehkan dengan pemberitahuan tertulis kepada PIHAK PERTAMA.'],
                    ['text' => 'PIHAK KEDUA tetap bertanggung jawab penuh atas pekerjaan yang dilaksanakan oleh sub-kontraktor.'],
                ],
            ],
            [
                'judul' => 'KEADAAN KAHAR',
                'intro' => '',
                'poin' => [
                    ['text' => 'Suatu peristiwa yang terjadi di luar kendali para pihak, tidak dapat diramalkan, dan tidak dapat dihindari.'],
                    ['text' => 'Termasuk: bencana alam, perang, kerusuhan, wabah penyakit, dan kebijakan pemerintah yang berdampak langsung.'],
                    ['text' => 'Pihak yang mengalami Keadaan Kahar wajib memberitahukan secara tertulis dalam waktu 14 hari.'],
                ],
            ],
            [
                'judul' => 'PEMUTUSAN PERJANJIAN',
                'intro' => 'Perjanjian ini dapat diakhiri lebih awal apabila:',
                'poin' => [
                    ['text' => 'Salah satu pihak tidak memenuhi kewajibannya dan tidak memperbaiki kelalaian dalam 30 hari setelah peringatan.'],
                    ['text' => 'Salah satu pihak dinyatakan pailit atau dibubarkan berdasarkan hukum yang berlaku.'],
                    ['text' => 'Terjadi Keadaan Kahar yang berlangsung lebih dari 6 bulan berturut-turut.'],
                    ['text' => 'Disepakati bersama oleh PARA PIHAK secara tertulis.'],
                ],
            ],
            [
                'judul' => 'PENYELESAIAN SENGKETA',
                'intro' => '',
                'poin' => [
                    ['text' => 'PARA PIHAK berkewajiban menyelesaikan setiap perselisihan secara musyawarah mufakat terlebih dahulu dalam 30 hari.'],
                    ['text' => 'Apabila tidak tercapai kesepakatan, para pihak sepakat untuk menyelesaikan melalui mediasi.'],
                    ['text' => 'Apabila mediasi tidak berhasil, penyelesaian dilakukan melalui Badan Arbitrase Nasional Indonesia (BANI).'],
                ],
            ],
            [
                'judul' => 'KERAHASIAAN DAN PENUTUP',
                'intro' => '',
                'poin' => [
                    ['text' => 'PARA PIHAK sepakat menjaga kerahasiaan seluruh informasi yang diperoleh dalam pelaksanaan Perjanjian ini.'],
                    ['text' => 'Hal-hal yang belum diatur akan diatur kemudian dalam addendum yang merupakan bagian tidak terpisahkan.'],
                    ['text' => 'Perjanjian ini dibuat dalam rangkap 2 (dua) bermaterai cukup dan memiliki kekuatan hukum yang sama.'],
                ],
            ],
        ];
    }
}
