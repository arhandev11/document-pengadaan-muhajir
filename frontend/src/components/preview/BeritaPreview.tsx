import { DocPaper } from '@/components/preview/DocPaper'
import { useLogo } from '@/hooks/use-logo'
import type { Berita } from '@/types/berita'
import type { Project } from '@/types/project'

interface Props {
  berita: Berita
  project: Project | undefined
}

/**
 * Mirror Doc Manager.html renderDocBerita (line 959-1017).
 * BAST format: judul tengah, identitas pihak, pasal-pasal hardcoded.
 */
export function BeritaPreview({ berita, project }: Props) {
  const { data: logo } = useLogo()

  const parties = [
    {
      no: 'I.',
      nama: project?.p1.nama,
      jabatan: project?.p1.jabatan,
      alamat: project?.p1.alamat,
      org: project?.p1.perusahaan,
      label: 'Pihak Pertama',
    },
    {
      no: 'II.',
      nama: project?.p2.nama,
      jabatan: project?.p2.jabatan,
      alamat: project?.p2.alamat,
      org: project?.p2.organisasi,
      label: 'Pihak Kedua',
    },
  ]

  return (
    <DocPaper>
      <div className="relative">
        {logo?.url ? (
          <img
            src={logo.url}
            alt="Logo"
            className="absolute top-0 right-0 max-h-[72px] max-w-[150px] object-contain"
          />
        ) : (
          <div className="absolute top-0 right-0 w-[110px] h-[56px] border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight no-print">
            Logo
            <br />
            Perusahaan
          </div>
        )}

        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-7">
            <div
              className="text-[21px] font-semibold tracking-wider uppercase mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.04em' }}
            >
              Berita Acara Serah Terima
            </div>
            <div>Nomor: {berita.nomor || '_______________'}</div>
            <div className="h-[2.5px] bg-[#1a1714] mx-auto mt-2.5 w-[100px]" />
          </div>

          <p className="mb-5 text-justify">
            Pada hari ini <strong>{berita.hari || '—'}</strong>, tanggal{' '}
            <strong>{berita.tanggal || '—'}</strong> bertempat di{' '}
            <strong>{berita.tempat || '—'}</strong>, telah disetujui dan ditandatangani Berita
            Acara Serah Terima, oleh dan antara:
          </p>

          {parties.map((p) => (
            <div key={p.no} className="mb-5">
              <table className="w-full text-[12.5px]">
                <tbody>
                  <tr>
                    <td className="w-6 font-bold align-top">{p.no}</td>
                    <td className="w-[72px] align-top">Nama</td>
                    <td className="w-[14px] text-center align-top">:</td>
                    <td className="align-top">{p.nama || '—'}</td>
                  </tr>
                  <tr>
                    <td />
                    <td className="align-top">Jabatan</td>
                    <td className="text-center align-top">:</td>
                    <td className="align-top">{p.jabatan || '—'}</td>
                  </tr>
                  <tr>
                    <td />
                    <td className="align-top">Alamat</td>
                    <td className="text-center align-top">:</td>
                    <td className="align-top">{p.alamat || '—'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="pl-6 mt-1">
                Bertindak untuk dan atas nama <strong>{p.org || '—'}</strong>, selanjutnya
                disebut sebagai <strong>{p.label}</strong>.
              </div>
            </div>
          ))}

          <p className="mb-6 text-justify">
            Dalam rangka pelaksanaan {berita.nama_kegiatan || '—'}, maka para pihak sepakat
            untuk melaksanakan serah terima barang sebagaimana tercantum pada pasal berikut:
          </p>

          {/* PASAL 1 */}
          <div className="text-center font-bold mb-0.5">PASAL 1</div>
          <div className="text-center font-bold mb-3">OBJEK SERAH TERIMA</div>
          <p className="mb-3">
            Pihak Pertama telah menyerahkan kepada Pihak Kedua berupa barang dengan rincian
            sebagai berikut:
          </p>

          <table className="w-full border-collapse mb-5 text-[11.5px]">
            <thead>
              <tr className="bg-[#1a1714] text-white">
                <th className="border border-[#222] px-2 py-2 text-center text-[11px] font-semibold">No</th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">Nama Barang</th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">Jumlah</th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">Spesifikasi</th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">Kondisi</th>
              </tr>
            </thead>
            <tbody>
              {berita.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="border border-[#e0e0e0] px-2 py-3 text-center italic text-gray-400">
                    (Belum ada item)
                  </td>
                </tr>
              )}
              {berita.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 ? 'bg-[#f9f7f4]' : ''}>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.nama || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.jumlah || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.spesifikasi || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.kondisi || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mb-5 text-justify">
            Barang-barang tersebut telah diterima dalam kondisi baik dan lengkap, sesuai dengan
            Surat Perintah Kerja (SPK) No. <strong>{project?.spk.nomor || '—'}</strong> tanggal{' '}
            <strong>{project?.spk.tanggal || '—'}</strong>
          </p>

          {/* PASAL 2 */}
          <div className="text-center font-bold mb-0.5">PASAL 2</div>
          <div className="text-center font-bold mb-3">KONDISI PENYERAHAN</div>
          <ol className="pl-6 mb-5 list-decimal space-y-2">
            <li className="text-justify">
              Pihak Kedua telah memeriksa dan menerima barang-barang sebagaimana disebutkan
              dalam Pasal 1, sesuai dengan jumlah, jenis, dan spesifikasi yang tercantum dalam
              dokumen pengadaan.
            </li>
            <li className="text-justify">
              Dengan ditandatanganinya Berita Acara ini, Pihak Pertama dianggap telah
              menyelesaikan kewajibannya sebagaimana diatur dalam SPK.
            </li>
            <li className="text-justify">
              Apabila di kemudian hari ditemukan kerusakan atau ketidaksesuaian minor, Pihak
              Pertama akan melakukan perbaikan atau penggantian sesuai ketentuan garansi.
            </li>
          </ol>

          {/* PASAL 3 */}
          <div className="text-center font-bold mb-0.5">PASAL 3</div>
          <div className="text-center font-bold mb-3">PENUTUP</div>
          <p className="mb-7 text-justify">
            Demikian Berita Acara Serah Terima Barang ini dibuat dan ditandatangani oleh kedua
            belah pihak dengan penuh kesadaran, tanpa paksaan dari pihak mana pun, untuk
            digunakan sebagaimana mestinya.
          </p>

          <p className="mb-9">
            Dibuat dan ditandatangani di {berita.tempat_buat || '—'}, tanggal{' '}
            {berita.tanggal_buat || '—'}
          </p>

          {/* Signatures — left & right */}
          <div className="flex justify-between mt-9">
            {[
              { label: 'Pihak Pertama', org: project?.p1.perusahaan, nama: project?.p1.nama, jabatan: project?.p1.jabatan },
              { label: 'Pihak Kedua', org: project?.p2.organisasi, nama: project?.p2.nama, jabatan: project?.p2.jabatan },
            ].map((sig) => (
              <div key={sig.label} className="text-center min-w-[200px]">
                <div>{sig.label}</div>
                <div className="font-semibold">{sig.org || '—'}</div>
                <div className="h-16" />
                <div className="border-b-[1.5px] border-[#222] pb-0.5 font-bold underline inline-block min-w-[160px]">
                  {sig.nama || '—'}
                </div>
                <div>{sig.jabatan || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DocPaper>
  )
}
