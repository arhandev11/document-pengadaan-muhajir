import { DocPaper } from '@/components/preview/DocPaper'
import { useLogo } from '@/hooks/use-logo'
import { computeItemTotal, toRp } from '@/lib/currency'
import type { Project } from '@/types/project'
import type { Surat } from '@/types/surat'

interface Props {
  surat: Surat
  project: Project | undefined
}

/**
 * Mirror Doc Manager.html renderDocSurat (line 911-957).
 * Surat penawaran format: kop logo, kepada Yth, paragraf, tabel items,
 * keterangan, signature.
 */
export function SuratPreview({ surat, project }: Props) {
  const { data: logo } = useLogo()
  const grandTotal = surat.items.reduce(
    (sum, item) => sum + computeItemTotal(item.jumlah, item.harga_satuan),
    0,
  )

  return (
    <DocPaper>
      <div className="relative">
        {/* Logo top-right */}
        {logo?.url ? (
          <img
            src={logo.url}
            alt="Logo"
            className="absolute top-0 right-0 max-h-[72px] max-w-[150px] object-contain"
          />
        ) : (
          <div className="absolute top-0 right-0 w-[120px] h-[56px] border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight no-print">
            Logo
            <br />
            Perusahaan
          </div>
        )}

        <div className="relative z-10">
          <div className="mb-1">
            Nomor: <strong>{surat.nomor || '_______________'}</strong>
          </div>
          <div className="mb-6">
            Perihal: <strong>{surat.perihal || '—'}</strong>
          </div>

          <div className="mb-5 leading-[1.9]">
            <div>
              <strong>Kepada Yth.</strong>
            </div>
            <div>
              <strong>{project?.p2.jabatan || '—'}</strong>
            </div>
            <div>
              <strong>{project?.p2.organisasi || '—'}</strong>
            </div>
            <div>di tempat</div>
          </div>

          <p className="mb-4">Dengan hormat,</p>

          <p className="mb-5 text-justify">
            Bersama surat ini kami dari{' '}
            <strong>{project?.p1.perusahaan || '—'}</strong> menyampaikan penawaran harga
            untuk keperluan {surat.nama_program || '—'} sebagai berikut:
          </p>

          <table className="w-full border-collapse mb-5 text-[11.5px]">
            <thead>
              <tr className="bg-[#1a1714] text-white">
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">
                  No.
                </th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">
                  Nama Barang
                </th>
                <th className="border border-[#222] px-2 py-2 text-left text-[11px] font-semibold">
                  Spesifikasi Teknis
                </th>
                <th className="border border-[#222] px-2 py-2 text-right text-[11px] font-semibold">
                  Jumlah
                </th>
                <th className="border border-[#222] px-2 py-2 text-right text-[11px] font-semibold">
                  Harga Satuan (Rp)
                </th>
                <th className="border border-[#222] px-2 py-2 text-right text-[11px] font-semibold">
                  Total Harga (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {surat.items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-[#e0e0e0] px-2 py-3 text-center italic text-gray-400"
                  >
                    (Belum ada item)
                  </td>
                </tr>
              )}
              {surat.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 ? 'bg-[#f9f7f4]' : ''}>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.nama || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2">{item.spesifikasi || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-right">{item.jumlah || ''}</td>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-right">
                    {toRp(item.harga_satuan)}
                  </td>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-right">
                    {toRp(computeItemTotal(item.jumlah, item.harga_satuan))}
                  </td>
                </tr>
              ))}
              {surat.items.length > 0 && (
                <tr className="bg-[#f5ead8] font-bold">
                  <td colSpan={5} className="border border-[#e0e0e0] px-2 py-2 text-right">
                    Total Penawaran
                  </td>
                  <td className="border border-[#e0e0e0] px-2 py-2 text-right">{toRp(grandTotal)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mb-5">
            <strong>Keterangan:</strong>
            <ul className="pl-6 mt-2 italic list-disc">
              <li>Barang baru dan bergaransi resmi selama {surat.garansi || '—'}</li>
              <li>Waktu pengiriman: {surat.waktu_kirim || '—'}.</li>
              <li>Masa berlaku penawaran: {surat.masa_berlaku || '—'}.</li>
            </ul>
          </div>

          <p className="mb-11 text-justify">
            Kami berharap penawaran ini dapat menjadi pertimbangan dan kami siap memberikan
            klarifikasi apabila diperlukan.
          </p>

          {/* Signature block - right aligned */}
          <div className="flex justify-end mt-9">
            <div className="text-center min-w-[200px]">
              <div>Hormat kami,</div>
              <div className="font-semibold">{project?.p1.perusahaan || '—'}</div>
              <div className="h-16" />
              <div className="border-b-[1.5px] border-[#222] pb-0.5 font-bold underline inline-block min-w-[160px]">
                {project?.p1.nama || '—'}
              </div>
              <div>{project?.p1.jabatan || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </DocPaper>
  )
}
