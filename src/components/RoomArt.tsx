export function RoomArt({ variant, className = "" }: { variant: string; className?: string }) {
  return <div className={`room-art room-art-${variant} ${className}`} aria-hidden="true">
    <div className="art-window"><div className="art-sun" /></div>
    <div className="art-bed art-bed-back"><span /></div>
    <div className="art-bed art-bed-front"><span /></div>
    <div className="art-plant"><i /><i /><i /><i /><i /></div>
    <div className="art-shadow" />
  </div>;
}
