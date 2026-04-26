import { DocPaper } from '@/components/preview/DocPaper'
import { useLogo } from '@/hooks/use-logo'
import type { Nda } from '@/types/nda'
import type { Project } from '@/types/project'

interface Props {
  nda: Nda
  project: Project | undefined
}

/**
 * Mirror Doc Manager.html renderDocNda (line 1407-1560).
 * Format NDA: judul, pihak penerima, pihak pengungkap (auto dari project.p1),
 * konsideran "BAHWA", 4 pasal hardcoded dengan placeholder dari fields.
 */
export function NdaPreview({ nda, project }: Props) {
  const { data: logo } = useLogo()

  const pengungkap = project?.p1.perusahaan || project?.p1.nama || '[Pihak Pengungkap]'
  const pengungkapWakil = project?.p1.nama || '[]'
  const pengungkapJabatan = project?.p1.jabatan || '[]'
  const pengungkapAlamat = project?.p1.alamat || '[]'

  const pn = nda.pihak_penerima
  const pnNama = pn.nama || 'ORANG A'
  const pnKtp = pn.ktp || '[]'
  const pnAlamat = pn.alamat || '[Alamat]'
  const pnJabatan = pn.jabatan || '[]'
  const pnOrganisasi = pn.organisasi || '[]'
  const pnKontrak = pn.nomor_kontrak || '[]'
  const pnTglKontrak = pn.tanggal_kontrak || '[]'

  const konteks = nda.konteks_pelaksanaan || '[]'
  const jenisDukungan = nda.jenis_dukungan || '[]'
  const objekKegiatan = nda.objek_kegiatan || '[]'
  const objekInfo = nda.objek_informasi || '[]'
  const jangka = nda.jangka_waktu || '2 (dua) tahun'

  return (
    <DocPaper className="leading-[1.85]">
      <div className="relative">
        {logo?.url ? (
          <img
            src={logo.url}
            alt="Logo"
            className="absolute top-0 right-0 max-h-[72px] max-w-[150px] object-contain"
          />
        ) : (
          <div className="absolute top-0 right-0 w-[110px] h-[50px] border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight no-print">
            Logo
            <br />
            Perusahaan
          </div>
        )}

        <div className="relative z-10">
          <div className="text-center mb-7">
            <div
              className="text-[22px] font-semibold tracking-wider uppercase mb-1.5"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.05em' }}
            >
              Pernyataan Kerahasiaan
            </div>
            <div className="text-[12px] text-gray-700 mb-0.5">
              (<em>Non-Disclosure Agreement</em>)
            </div>
            <div className="text-[12px]">
              Nomor: <strong>{nda.nomor || '_______________'}</strong>
            </div>
            <div
              className="h-[3px] mx-auto mt-3 w-[120px] rounded-sm"
              style={{ background: 'linear-gradient(to right, #8b6914, #1a1714)' }}
            />
          </div>

          <p className="mb-3.5 text-justify">
            <strong>PERNYATAAN KERAHASIAAN</strong> <em>("Pernyataan")</em> ini dibuat dan
            ditandatangani pada hari ini, <strong>{nda.hari || '—'}</strong>, tanggal{' '}
            <strong>{nda.tanggal || '—'}</strong>, bertempat di{' '}
            <strong>{nda.tempat || '—'}</strong>, oleh:
          </p>

          {/* Pihak Penerima */}
          <div className="mb-4 pl-4">
            <table className="w-full text-[12.5px]">
              <tbody>
                <tr>
                  <td className="w-7 font-bold align-top">I.</td>
                  <td className="w-[160px] align-top">Nama</td>
                  <td className="w-[14px] text-center align-top">:</td>
                  <td className="align-top">
                    <strong>{pnNama}</strong>
                  </td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">No. KTP</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">{pnKtp}</td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">Alamat</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">{pnAlamat}</td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">Jabatan</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">
                    {pnJabatan} pada {pnOrganisasi}
                  </td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">No. Kontrak / SPK</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">
                    {pnKontrak} tertanggal {pnTglKontrak}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="pl-7 mt-1.5 italic">
              Selanjutnya disebut sebagai <strong>"Pihak Penerima"</strong>.
            </div>
          </div>

          <p className="mb-3.5 text-justify">dengan ini menyatakan kepada:</p>

          {/* Pihak Pengungkap */}
          <div className="mb-4 pl-4">
            <table className="w-full text-[12.5px]">
              <tbody>
                <tr>
                  <td className="w-7 font-bold align-top">II.</td>
                  <td className="w-[160px] align-top">Nama Perusahaan</td>
                  <td className="w-[14px] text-center align-top">:</td>
                  <td className="align-top">
                    <strong>{pengungkap}</strong>
                  </td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">Diwakili oleh</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">
                    {pengungkapWakil} selaku {pengungkapJabatan}
                  </td>
                </tr>
                <tr>
                  <td />
                  <td className="align-top">Alamat</td>
                  <td className="text-center align-top">:</td>
                  <td className="align-top">{pengungkapAlamat}</td>
                </tr>
              </tbody>
            </table>
            <div className="pl-7 mt-1.5 italic">
              Selanjutnya disebut sebagai <strong>"Pihak Pengungkap"</strong>.
            </div>
          </div>

          <p className="mb-3.5 text-justify">
            Pihak Penerima dan Pihak Pengungkap untuk selanjutnya, secara bersama-sama disebut
            sebagai <strong>"Para Pihak"</strong> dan masing-masing sebagai{' '}
            <strong>"Pihak"</strong>.
          </p>

          <p className="mb-3.5 text-justify">Pihak Penerima pertama-tama menjelaskan sebagai berikut:</p>

          <div className="mb-4 pl-4 space-y-3.5 text-justify">
            <p>
              <strong>BAHWA</strong>, dalam melaksanakan {konteks}, Pihak Pengungkap
              memerlukan dukungan Pihak Penerima dalam suatu {jenisDukungan} yang akan membantu
              dan mendampingi Pihak Pengungkap dalam menjalankan {objekKegiatan}.
            </p>
            <p>
              <strong>BAHWA</strong>, Pihak Penerima akan menerima seluruh informasi yang
              berkaitan dengan {objekInfo} dari Pihak Pengungkap dan akan menganalisisnya
              sebagai bentuk dari proses pendampingan.
            </p>
            <p>
              <strong>BAHWA</strong>, Pihak Penerima setuju dan menegaskan bahwa ia akan
              menerima seluruh informasi tersebut yang diberikan oleh Pihak Pengungkap secara
              rahasia sebagaimana diatur dalam Pernyataan ini.
            </p>
          </div>

          <p className="mb-3.5 text-justify">
            <strong>DENGAN DEMIKIAN</strong>, berdasarkan pertimbangan-pertimbangan sebagaimana
            disebutkan di atas, Pihak Penerima setuju untuk mengikatkan diri terhadap
            syarat-syarat dan ketentuan-ketentuan sebagaimana berikut, sesuai dengan ketentuan
            Pasal 1320 KUHPerdata tentang syarat sahnya perjanjian:
          </p>

          <PasalNda nomor={1} judul="Informasi Rahasia">
            <ol className="pl-6 leading-[2] list-decimal space-y-3.5">
              <li className="text-justify">
                "<strong>Informasi Rahasia</strong>" adalah seluruh dokumentasi, data, strategi,
                sistem teknologi informasi, dan informasi lainnya yang terkait dengan{' '}
                {objekInfo}, yang dilindungi berdasarkan Undang-Undang Nomor 30 Tahun 2000
                tentang Rahasia Dagang.
              </li>
              <li className="text-justify">
                Tunduk pada Hukum Yang Berlaku, Pihak Penerima setuju untuk tidak mengungkapkan
                secara tidak perlu dan harus mengambil semua tindakan yang diperlukan untuk
                melindungi dan menghindari pengungkapan yang tidak perlu atau penyalahgunaan
                Informasi Rahasia yang disediakan oleh Pihak Pengungkap sebagai bagian dari
                proses pendampingan.
              </li>
              <li className="text-justify">
                Pihak Penerima setuju bahwa Informasi Rahasia yang diberikan padanya akan
                dipegang sesuai dengan Hukum Yang Berlaku dan tidak akan digunakan untuk tujuan
                apapun selain tujuan yang dimaksud dalam Pernyataan ini. Kewajiban kerahasiaan
                ini berlaku selama <strong>{jangka}</strong> sejak tanggal ditandatanganinya
                Pernyataan ini.
              </li>
            </ol>
          </PasalNda>

          <PasalNda nomor={2} judul="Informasi Bukan Rahasia">
            <p className="mb-3.5 text-justify">
              Meskipun demikian, hal-hal berikut ini tidak akan menjadi Informasi Rahasia untuk
              tujuan Pernyataan ini:
            </p>
            <ol
              className="pl-6 leading-[2] space-y-3.5"
              style={{ listStyleType: 'lower-alpha' }}
            >
              <li className="text-justify">
                Informasi yang umumnya tersedia untuk umum selain sebagai hasil pengungkapan
                oleh Pihak Penerima dalam pelanggaran kewajiban yang dibebankan oleh Pernyataan
                ini atau kewajiban kerahasiaan lainnya yang berkaitan dengan Informasi Rahasia;
              </li>
              <li className="text-justify">
                Informasi yang tersedia bagi Pihak Penerima secara tidak rahasia sebelum
                pengungkapan informasi tersebut kepada Pihak Penerima oleh Pihak Pengungkap;
                atau
              </li>
              <li className="text-justify">
                Informasi yang diterima oleh Pihak Penerima dari pihak ketiga yang tidak
                memiliki kewajiban kerahasiaan kepada Pihak Pengungkap.
              </li>
            </ol>
          </PasalNda>

          <PasalNda nomor={3} judul="Kewajiban Pihak Penerima">
            <ol className="pl-6 leading-[2] list-decimal space-y-3.5">
              <li className="text-justify">
                Pihak Penerima dengan ini berjanji dan setuju bahwa ia akan menggunakan
                informasi dan dokumen yang diterima dari Pihak Pengungkap semata-mata untuk
                tujuan proses pendampingan dan hanya akan mereproduksi dokumen-dokumen tersebut
                sebagaimana sewajarnya dianggap perlu untuk tujuan tersebut.
              </li>
              <li className="text-justify">
                Jika Pihak Penerima atau Perwakilannya diwajibkan oleh hukum untuk memberikan
                Informasi Rahasia milik Pihak Pengungkap, Pihak Penerima sejauh ia mampu harus
                memberitahukan dan berkonsultasi dengan Pihak Pengungkap atas fakta tersebut
                dan harus menggunakan upaya yang wajar untuk membatasi pengungkapan Informasi
                Rahasia yang harus disediakan.
              </li>
              <li className="text-justify">
                Pihak Penerima dapat berbagi Informasi Rahasia yang diterima dengan penasihat
                profesionalnya yang terlibat untuk membantu sehubungan dengan pekerjaan dan
                akan memberi tahu penasihatnya tentang ketentuan Pernyataan ini.
              </li>
              <li className="text-justify">
                Jika Pihak Penerima atau Perwakilannya melakukan penyalahgunaan Informasi
                Rahasia yang diterima dari Pihak Pengungkap, bersedia untuk menerima sanksi
                administratif dan/atau pidana sesuai dengan ketentuan perundang-undangan yang
                berlaku, termasuk namun tidak terbatas pada ketentuan Pasal 17 ayat (1)
                Undang-Undang Nomor 30 Tahun 2000 tentang Rahasia Dagang.
              </li>
            </ol>
          </PasalNda>

          <PasalNda nomor={4} judul="Ketentuan Lain-Lain">
            <ol className="pl-6 leading-[2] list-decimal space-y-3.5">
              <li className="text-justify">
                Judul dalam Pernyataan ini hanya untuk kenyamanan dan tidak berpengaruh
                terhadap interpretasi di dalamnya.
              </li>
              <li className="text-justify">
                Pernyataan ini mengikat Pihak Penerima di sini dan para penerima serta
                penerusnya masing-masing.
              </li>
              <li className="text-justify">
                Tidak ada Pihak yang dianggap telah mengenyampingkan setiap hak berdasarkan
                Pernyataan ini, kecuali Pihak tersebut menyampaikan kepada Pihak lain
                pengenyampingan tertulis yang ditandatangani oleh pejabat yang berwenang dari
                Pihak yang mengenyampingkan.
              </li>
              <li className="text-justify">
                Dalam hal ketentuan apapun dalam Pernyataan ini akan ditafsirkan ilegal atau
                tidak sah karena alasan apapun, ketentuan tersebut tidak akan mempengaruhi
                ketentuan lainnya, dan Pernyataan ini akan ditafsirkan seolah-olah ketentuan
                ilegal atau tidak sah tersebut tidak pernah menjadi bagian dari Pernyataan ini.
              </li>
              <li className="text-justify">
                Pernyataan ini dibuat dan berlaku dalam versi Bahasa Indonesia dan tunduk pada
                hukum Negara Republik Indonesia, khususnya Undang-Undang Nomor 30 Tahun 2000
                tentang Rahasia Dagang dan Pasal 1320 KUHPerdata.
              </li>
            </ol>
          </PasalNda>

          <div
            className="mt-7 mb-2.5 px-4 py-3 rounded-r-md text-[12px]"
            style={{ background: '#faf9f7', borderLeft: '3px solid #8b6914', color: '#5c5548' }}
          >
            <strong>Lembar Penandatanganan</strong>
            <br />
            Dengan Demikian, Pihak Penerima (atau wakilnya yang sah) dengan ini menandatangani
            Pernyataan Kerahasiaan ini pada tanggal yang dinyatakan pada permulaan Pernyataan
            ini.
          </div>

          <div className="mt-9 flex justify-between">
            <div className="text-center min-w-[220px]">
              <div className="font-bold mb-1">Pihak Penerima</div>
              <div className="text-[11.5px] text-gray-600 mb-[72px]">{pnOrganisasi}</div>
              <div className="border-b-[1.5px] border-[#222] pb-0.5 font-bold underline inline-block min-w-[180px]">
                {pnNama}
              </div>
              <div className="text-[12px] mt-0.5">{pnJabatan}</div>
            </div>
            <div className="text-center min-w-[220px]">
              <div className="font-bold mb-1">Pihak Pengungkap</div>
              <div className="text-[11.5px] text-gray-600 mb-[72px]">{pengungkap}</div>
              <div className="border-b-[1.5px] border-[#222] pb-0.5 font-bold underline inline-block min-w-[180px]">
                {pengungkapWakil}
              </div>
              <div className="text-[12px] mt-0.5">{pengungkapJabatan}</div>
            </div>
          </div>

          <div className="mt-9 pt-3.5 border-t border-gray-200 text-[10.5px] text-gray-500 text-center leading-[1.7]">
            Dokumen ini dilindungi oleh Undang-Undang Nomor 30 Tahun 2000 tentang Rahasia Dagang.
            <br />
            Keabsahan perjanjian ini mengacu pada Pasal 1320 KUHPerdata (syarat sah perjanjian).
            <br />
            Pelanggaran terhadap pernyataan ini dapat dikenakan sanksi pidana sesuai Pasal 17
            ayat (1) UU No. 30 Tahun 2000.
          </div>
        </div>
      </div>
    </DocPaper>
  )
}

function PasalNda({
  nomor,
  judul,
  children,
}: {
  nomor: number
  judul: string
  children: React.ReactNode
}) {
  return (
    <div className="break-inside-avoid">
      <div className="text-center font-bold text-[13px] mt-5 mb-0.5">Pasal {nomor}</div>
      <div className="text-center font-bold text-[12.5px] uppercase mb-2.5 tracking-wide">
        {judul}
      </div>
      {children}
    </div>
  )
}
