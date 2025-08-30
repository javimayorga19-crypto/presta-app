import { forwardRef } from 'react'
import { format } from 'date-fns'

interface PaymentData {
  numeroRecibo: string
  fecha: string
  cliente: {
    nombre: string
    codigo: string
    cedula?: string
  }
  prestamo: {
    codigo: string
    montoOriginal: number
  }
  pago: {
    monto: number
    saldoAnterior: number
    saldoNuevo: number
    metodoPago: string
  }
  cobrador: string
  observaciones?: string
}

interface DisbursementData {
  numeroComprobante: string
  fecha: string
  cliente: {
    nombre: string
    codigo: string
    cedula?: string
  }
  prestamo: {
    codigo: string
    monto: number
    plazo: number
    valorCuota: number
    tasaInteres: number
    frecuencia: string
  }
  cobrador: string
  observaciones?: string
}

// Recibo de pago 80mm
export const PaymentReceipt80mm = forwardRef<HTMLDivElement, { data: PaymentData }>(
  ({ data }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount)
    }

    return (
      <div 
        ref={ref} 
        className="print-receipt-80mm"
        style={{
          width: '80mm',
          maxWidth: '80mm',
          fontSize: '10px',
          fontFamily: 'monospace',
          lineHeight: '1.2',
          padding: '5px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            CRÉDITOS Y PRÉSTAMOS
          </div>
          <div style={{ fontSize: '8px' }}>
            Recibo de Pago
          </div>
          <div style={{ fontSize: '8px', borderTop: '1px dashed #000', paddingTop: '2px' }}>
            No. {data.numeroRecibo}
          </div>
        </div>

        {/* Date and Time */}
        <div style={{ marginBottom: '8px', fontSize: '8px' }}>
          <div>Fecha: {format(new Date(data.fecha), 'dd/MM/yyyy HH:mm')}</div>
        </div>

        {/* Client Info */}
        <div style={{ marginBottom: '8px', fontSize: '8px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '4px' }}>
            <div>Cliente: {data.cliente.nombre}</div>
            <div>Código: {data.cliente.codigo}</div>
            {data.cliente.cedula && <div>CC: {data.cliente.cedula}</div>}
          </div>
        </div>

        {/* Loan Info */}
        <div style={{ marginBottom: '8px', fontSize: '8px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '4px' }}>
            <div>Préstamo: {data.prestamo.codigo}</div>
            <div>Monto Original: {formatCurrency(data.prestamo.montoOriginal)}</div>
          </div>
        </div>

        {/* Payment Details */}
        <div style={{ marginBottom: '8px', fontSize: '8px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Saldo Anterior:</span>
              <span>{formatCurrency(data.pago.saldoAnterior)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Pago Recibido:</span>
              <span>{formatCurrency(data.pago.monto)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Saldo Nuevo:</span>
              <span>{formatCurrency(data.pago.saldoNuevo)}</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <div>Método: {data.pago.metodoPago}</div>
            </div>
          </div>
        </div>

        {/* Observations */}
        {data.observaciones && (
          <div style={{ marginBottom: '8px', fontSize: '8px' }}>
            <div style={{ borderTop: '1px dashed #000', paddingTop: '4px' }}>
              <div>Observaciones:</div>
              <div>{data.observaciones}</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '8px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '4px' }}>
            <div>Cobrador: {data.cobrador}</div>
            <div style={{ marginTop: '4px' }}>
              ¡Gracias por su pago!
            </div>
          </div>
        </div>
      </div>
    )
  }
)

// Recibo de pago 58mm
export const PaymentReceipt58mm = forwardRef<HTMLDivElement, { data: PaymentData }>(
  ({ data }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount)
    }

    return (
      <div 
        ref={ref} 
        className="print-receipt-58mm"
        style={{
          width: '58mm',
          maxWidth: '58mm',
          fontSize: '8px',
          fontFamily: 'monospace',
          lineHeight: '1.1',
          padding: '3px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>
            CRÉDITOS
          </div>
          <div style={{ fontSize: '7px' }}>
            Recibo No. {data.numeroRecibo}
          </div>
        </div>

        {/* Date */}
        <div style={{ marginBottom: '6px', fontSize: '7px' }}>
          <div>{format(new Date(data.fecha), 'dd/MM/yyyy HH:mm')}</div>
        </div>

        {/* Client */}
        <div style={{ marginBottom: '6px', fontSize: '7px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '3px' }}>
            <div>{data.cliente.nombre}</div>
            <div>Cód: {data.cliente.codigo}</div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ marginBottom: '6px', fontSize: '7px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Saldo Ant:</span>
              <span>{formatCurrency(data.pago.saldoAnterior)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Pago:</span>
              <span>{formatCurrency(data.pago.monto)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Saldo:</span>
              <span>{formatCurrency(data.pago.saldoNuevo)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '6px', textAlign: 'center', fontSize: '7px' }}>
          <div style={{ borderTop: '1px dashed #000', paddingTop: '3px' }}>
            <div>{data.cobrador}</div>
            <div>¡Gracias!</div>
          </div>
        </div>
      </div>
    )
  }
)

// Comprobante de desembolso carta
export const DisbursementReceiptLetter = forwardRef<HTMLDivElement, { data: DisbursementData }>(
  ({ data }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount)
    }

    return (
      <div 
        ref={ref} 
        className="print-letter"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.4'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
            COMPROBANTE DE DESEMBOLSO
          </h1>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            No. {data.numeroComprobante}
          </div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            Fecha: {format(new Date(data.fecha), 'dd \'de\' MMMM \'de\' yyyy')}
          </div>
        </div>

        {/* Client Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>
            INFORMACIÓN DEL CLIENTE
          </h3>
          <table style={{ width: '100%', marginTop: '15px' }}>
            <tbody>
              <tr>
                <td style={{ width: '25%', fontWeight: 'bold' }}>Nombre:</td>
                <td>{data.cliente.nombre}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Código:</td>
                <td>{data.cliente.codigo}</td>
              </tr>
              {data.cliente.cedula && (
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Cédula:</td>
                  <td>{data.cliente.cedula}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Loan Details */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>
            DETALLES DEL PRÉSTAMO
          </h3>
          <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '25%', fontWeight: 'bold', padding: '8px 0' }}>Código del Préstamo:</td>
                <td style={{ padding: '8px 0' }}>{data.prestamo.codigo}</td>
              </tr>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <td style={{ fontWeight: 'bold', padding: '8px 0' }}>Monto Desembolsado:</td>
                <td style={{ fontSize: '16px', fontWeight: 'bold', padding: '8px 0' }}>
                  {formatCurrency(data.prestamo.monto)}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px 0' }}>Plazo:</td>
                <td style={{ padding: '8px 0' }}>{data.prestamo.plazo} días</td>
              </tr>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <td style={{ fontWeight: 'bold', padding: '8px 0' }}>Valor de Cuota:</td>
                <td style={{ padding: '8px 0' }}>{formatCurrency(data.prestamo.valorCuota)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px 0' }}>Frecuencia de Pago:</td>
                <td style={{ padding: '8px 0', textTransform: 'capitalize' }}>{data.prestamo.frecuencia}</td>
              </tr>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <td style={{ fontWeight: 'bold', padding: '8px 0' }}>Tasa de Interés:</td>
                <td style={{ padding: '8px 0' }}>{data.prestamo.tasaInteres}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>
            TÉRMINOS Y CONDICIONES
          </h3>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              El cliente se compromete a pagar la cuota acordada en la frecuencia establecida.
            </li>
            <li style={{ marginBottom: '8px' }}>
              Los pagos atrasados generarán intereses de mora según las políticas de la empresa.
            </li>
            <li style={{ marginBottom: '8px' }}>
              El cliente acepta las visitas del cobrador en el domicilio o lugar de trabajo.
            </li>
            <li style={{ marginBottom: '8px' }}>
              En caso de incumplimiento, se procederá según los mecanismos legales establecidos.
            </li>
          </ul>
        </div>

        {/* Observations */}
        {data.observaciones && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '5px' }}>
              OBSERVACIONES
            </h3>
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
              {data.observaciones}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '40%', textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px', marginTop: '60px' }}>
                <div style={{ fontWeight: 'bold' }}>CLIENTE</div>
                <div style={{ fontSize: '10px' }}>{data.cliente.nombre}</div>
                <div style={{ fontSize: '10px' }}>CC: {data.cliente.cedula}</div>
              </div>
            </div>
            <div style={{ width: '40%', textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px', marginTop: '60px' }}>
                <div style={{ fontWeight: 'bold' }}>COBRADOR</div>
                <div style={{ fontSize: '10px' }}>{data.cobrador}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', textAlign: 'center', fontSize: '10px', color: '#666' }}>
          <div>Este documento constituye un comprobante de desembolso de préstamo</div>
          <div>Generado el {format(new Date(), 'dd/MM/yyyy \'a las\' HH:mm')}</div>
        </div>
      </div>
    )
  }
)

PaymentReceipt80mm.displayName = 'PaymentReceipt80mm'
PaymentReceipt58mm.displayName = 'PaymentReceipt58mm'
DisbursementReceiptLetter.displayName = 'DisbursementReceiptLetter'