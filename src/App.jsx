export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a1628 0%, #1d3566 100%)', color: '#fff', fontFamily: 'sans-serif', padding: '40px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>G&G SANITATION DIGITAL</h1>
      <img src="/macy-cupcake.jpg" alt="MACY" style={{ width: '180px', height: '180px', borderRadius: '50%', marginBottom: '24px' }} />
      <button style={{ padding: '20px 40px', fontSize: '18px', fontWeight: 'bold', borderRadius: '16px', border: 'none', background: '#fff', color: '#0a1628', cursor: 'pointer' }}>
        Start Sanitation
      </button>
      <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.5)' }}>v2.0</p>
    </div>
  )
}
