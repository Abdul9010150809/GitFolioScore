import React from 'react';
import { Image, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ExportReport({ targetRef }) {
  const exportAsImage = async () => {
    if (!targetRef?.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'gitfolioscore-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Export failed:', err);
    }
  };

  const exportAsPDF = async () => {
    if (!targetRef?.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('gitfolioscore-report.pdf');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('PDF export failed:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportAsImage}
        className="btn-secondary flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl hover:shadow-md transition-all"
      >
        <Image className="w-4 h-4" />
        Export PNG
      </button>
      <button
        onClick={exportAsPDF}
        className="btn-secondary flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl hover:shadow-md transition-all"
      >
        <FileText className="w-4 h-4" />
        Export PDF
      </button>
    </div>
  );
}

export default ExportReport;
