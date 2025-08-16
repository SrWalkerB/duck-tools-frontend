export function TitlePage({title}: { title: string }){
  return (
    <div className='p-4 mb-4'>
      <span className='font-bold text-5xl'>{title}</span>
    </div>
  )
}
