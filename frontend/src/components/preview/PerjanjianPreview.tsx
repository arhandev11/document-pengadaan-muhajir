import { DocPaper } from '@/components/preview/DocPaper'
import type { Perjanjian } from '@/types/perjanjian'
import type { Project } from '@/types/project'

interface Props {
  perjanjian: Perjanjian
  project: Project | undefined
}

/**
 * Mirror Doc Manager.html renderDocPerjanjian (line 1019-1067).
 * Format: judul tengah, pihak pertama+kedua, konsideran, pasal-pasal
 * dynamic dari state.perjanjian.pasal, signature.
 */
export function PerjanjianPreview({ perjanjian, project }: Props) {
  const tipeLabel = perjanjian.tipe === 'jasa' ? 'Pengadaan Jasa' : 'Pengadaan Barang'
  const totalPoin = perjanjian.pasal.reduce((sum, p) => sum + p.poin.length, 0)

  const parties = [
    {
      no: 'I.',
      nama: project?.p1.nama,
      jabatan: project?.p1.jabatan,
      org: project?.p1.perusahaan,
      alamat: project?.p1.alamat,
      label: 'PIHAK PERTAMA',
    },
    {
      no: 'II.',
      nama: project?.p2.nama,
      jabatan: project?.p2.jabatan,
      org: project?.p2.organisasi,
      alamat: project?.p2.alamat,
      label: 'PIHAK KEDUA',
    },
  ]

  return (
    <DocPaper className="leading-[1.8]">
      {/* Title block */}
      <div className="text-center mb-8">
        <div
          className="text-[20px] font-semibold tracking-wider uppercase mb-1.5"
          style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.05em' }}
        >
          {perjanjian.judul || 'Surat Perjanjian Kerjasama'}
        </div>
        <div className="text-[12px]">
          Nomor: <strong>{perjanjian.nomor || '___/___/___'}</strong>
        </div>
        <div className="text-[11px] text-gray-600 mt-0.5">Jenis: {tipeLabel}</div>
        <div
          className="h-[3px] mx-auto mt-3.5 w-[140px] rounded-sm"
          style={{ background: 'linear-gradient(to right, #8b6914, #1a1714)' }}
        />
      </div>

      <p className="mb-5 text-justify">
        Perjanjian ini dibuat dan ditandatangani pada hari {perjanjian.hari_ttd || '___'},
        tanggal <strong>{perjanjian.tanggal || '—'}</strong>, bertempat di{' '}
        <strong>{perjanjian.tempat || '—'}</strong>, oleh dan antara:
      </p>

      {parties.map((p) => (
        <div key={p.no} className="mb-5 pl-5">
          <table className="w-full text-[12.5px]">
            <tbody>
              <tr>
                <td className="w-7 font-bold align-top pr-1.5">{p.no}</td>
                <td className="w-[140px] align-top text-gray-600">Nama</td>
                <td className="w-4 text-center align-top">:</td>
                <td className="align-top">{p.nama || '—'}</td>
              </tr>
              <tr>
                <td />
                <td className="align-top text-gray-600">Jabatan</td>
                <td className="text-center align-top">:</td>
                <td className="align-top">{p.jabatan || '—'}</td>
              </tr>
              <tr>
                <td />
                <td className="align-top text-gray-600">Bertindak atas nama</td>
                <td className="text-center align-top">:</td>
                <td className="align-top">{p.org || '—'}</td>
              </tr>
              <tr>
                <td />
                <td className="align-top text-gray-600">Alamat</td>
                <td className="text-center align-top">:</td>
                <td className="align-top">{p.alamat || '—'}</td>
              </tr>
            </tbody>
          </table>
          <div className="pl-7 mt-1 italic">
            Selanjutnya disebut sebagai <strong>"{p.label}"</strong>.
          </div>
        </div>
      ))}

      <p className="mb-2 text-justify">
        PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut <strong>"PARA PIHAK"</strong>.
      </p>

      {perjanjian.konsideran && (
        <div
          className="my-5 px-4 py-3.5 rounded-r-md"
          style={{ background: '#faf9f7', borderLeft: '3px solid #8b6914' }}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b6914] mb-1.5">
            Menimbang
          </div>
          <p className="text-justify text-[12.5px]">{perjanjian.konsideran}</p>
        </div>
      )}

      <p className="my-5 text-center font-semibold">
        Maka berdasarkan hal tersebut di atas, PARA PIHAK sepakat untuk mengadakan
        Perjanjian Kerjasama dengan ketentuan sebagai berikut:
      </p>

      {/* Pasal-pasal */}
      {perjanjian.pasal.map((pasal, idx) => (
        <div key={pasal.id} className="mb-6 break-inside-avoid">
          <div className="text-center font-bold text-[13px] mb-0.5">PASAL {idx + 1}</div>
          <div className="text-center font-bold text-[13px] mb-2.5 uppercase">
            {pasal.judul || ''}
          </div>
          {pasal.intro && <p className="mb-2.5 text-justify">{pasal.intro}</p>}
          {pasal.poin.length > 0 && (
            <ol className="pl-6 leading-[2] list-decimal">
              {pasal.poin.map((poin) => (
                <li
                  key={poin.id}
                  className="text-justify"
                  style={{ marginBottom: poin.sub.length > 0 ? '6px' : '2px' }}
                >
                  {poin.text || ''}
                  {poin.sub.length > 0 && (
                    <ol type="a" className="pl-5 mt-1" style={{ listStyleType: 'lower-alpha' }}>
                      {poin.sub.map((sub) => (
                        <li key={sub.id} className="text-justify mb-0.5">
                          {sub.text || ''}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}

      <div className="mt-8 mb-4 text-justify text-[12px]">
        Demikian Perjanjian ini dibuat dalam rangkap 2 (dua) bermaterai cukup, dan masing-
        masing memiliki kekuatan hukum yang sama, ditandatangani di{' '}
        <strong>{perjanjian.tempat || '—'}</strong> pada tanggal{' '}
        <strong>{perjanjian.tanggal || '—'}</strong>.
      </div>

      <div className="flex justify-between mt-9">
        {parties.map((p) => (
          <div key={p.no} className="text-center min-w-[200px]">
            <div className="font-semibold">{p.label}</div>
            <div className="text-[11.5px] text-gray-600">{p.org || '—'}</div>
            <div className="h-[72px]" />
            <div className="border-b-[1.5px] border-[#222] pb-0.5 font-bold underline inline-block min-w-[160px]">
              {p.nama || '—'}
            </div>
            <div className="text-[12px]">{p.jabatan || '—'}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-gray-500 text-center mt-6 pt-3 border-t border-gray-200 no-print">
        {perjanjian.pasal.length} pasal · {totalPoin} poin
      </div>
    </DocPaper>
  )
}
