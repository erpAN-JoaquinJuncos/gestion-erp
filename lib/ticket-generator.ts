import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TicketData {
    fecha: string;
    cliente: string;
    items: { nombre: string; cantidad: number; precio: number }[];
    subtotal: number;
    descuento: number;
    total: number;
    metodoPago: string;
    idVenta?: string;
    // Config
    empresaNombre?: string;
    ticketHeader?: string;
    ticketFooter?: string;
}

export const generateTicket = (data: TicketData) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200] // Formato ticket térmico (80mm ancho)
    });

    const centerX = 40;
    let cursorY = 10;

    const nombreEmpresa = data.empresaNombre || "erpAN";
    const headerTexto = data.ticketHeader || "Sistema de Gestión";
    const footerTexto = data.ticketFooter || "¡Gracias por su compra!";

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(nombreEmpresa, centerX, cursorY, { align: "center" });

    cursorY += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(headerTexto, centerX, cursorY, { align: "center" });

    cursorY += 4;
    doc.text("--------------------------------", centerX, cursorY, { align: "center" });

    cursorY += 5;
    doc.text(`Fecha: ${data.fecha}`, 5, cursorY);
    cursorY += 4;
    if (data.idVenta) {
        doc.text(`Ticket #: ${data.idVenta.slice(0, 8)}`, 5, cursorY);
        cursorY += 4;
    }
    doc.text(`Cliente: ${data.cliente}`, 5, cursorY);

    cursorY += 2;
    doc.text("--------------------------------", centerX, cursorY, { align: "center" });
    cursorY += 5;

    // Items Table
    const tableColumn = ["Cant", "Prod", "Total"];
    const tableRows = data.items.map(item => [
        item.cantidad,
        item.nombre.substring(0, 15), // Truncar nombre largo
        `$${(item.cantidad * item.precio).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: cursorY,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 1, overflow: 'ellipsize' },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 'auto' }, // Producto
            2: { cellWidth: 20, halign: 'right' }
        },
        margin: { left: 2, right: 2 },
    });

    // @ts-ignore
    cursorY = doc.lastAutoTable.finalY + 5;

    // Totals
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 75, cursorY, { align: "right" });

    if (data.descuento > 0) {
        cursorY += 4;
        doc.text(`Desc: -$${data.descuento.toFixed(2)}`, 75, cursorY, { align: "right" });
    }

    cursorY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`TOTAL: $${data.total.toFixed(2)}`, 75, cursorY, { align: "right" });

    cursorY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Pago: ${data.metodoPago}`, 75, cursorY, { align: "right" });

    // Footer
    cursorY += 10;
    doc.text("--------------------------------", centerX, cursorY, { align: "center" });
    cursorY += 4;
    doc.text(footerTexto, centerX, cursorY, { align: "center" });

    // Guardar
    doc.save(`ticket_${new Date().getTime()}.pdf`);
};
