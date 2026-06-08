import { useNavigate } from 'react-router-dom'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="brand">G&amp;G SANITATION DIGITAL</div>
        <img
          src="/macy-cupcake.jpg"
          alt="MACY Cupcake"
          className="prod-img"
        />
        <button
          className="btn-san"
          onClick={() => navigate('/lines')}
        >
          Start Sanitation
        </button>
        <div className="version">v2.0</div>
      </div>
    </div>
  )
}
