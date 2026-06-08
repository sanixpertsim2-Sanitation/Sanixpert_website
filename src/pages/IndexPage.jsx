import { useNavigate } from 'react-router-dom'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)', textAlign: 'center', padding: '40px 24px', color: '#fff' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
          G&G SANITATION DIGITAL
        </div>
        <img
          src="/macy-cupcake.jpg"
          alt="MACY Cupcake"
          style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 32px', boxShadow: '0 16px 48px rgba(0,0,0,0.3)', border: '3px solid rgba(255,255,255,0.1)' }}
        />
        <button
          onClick={() => navigate('/lines')}
          style={{ fontSize: '1.35rem', fontWeight: 700, padding: '26px 48px', minHeight: '80px', borderRadius: '20px', background: '#fff', color: '#0a1628', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', width: '100%', cursor: 'pointer' }}
        >
          Start Sanitation
        </button>
        <div style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>v2.0</div>
      </div>
    </div>
  )
}
