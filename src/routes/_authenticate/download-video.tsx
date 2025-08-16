import { TitlePage } from '@/components/title-page'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Download } from "lucide-react";
import { api } from '@/lib/axios'

export const Route = createFileRoute('/_authenticate/download-video')({
  component: RouteComponent,
})

const urlSchema = z.object({
  url: z.url({error: "Invalid URL"})
})

function RouteComponent() {
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: 'https://www.youtube.com/watch?v=2AilA-M6N5U&list=RDE5488fUMLXs&index=2',
    },
  })

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const onSubmit =  async (values: z.infer<typeof urlSchema>) => {
    console.log('Form submitted:', values)

    const response = await api.post('/youtube/download-video', values, {
      responseType: 'blob',
    })

    if (response.status === 201) {
        const contentDisposition = response.headers['content-disposition']
        let filename = 'video.mp4'

        console.log(contentDisposition)
        downloadFile(response.data, filename)
        console.log('Video downloaded successfully')
    } else {
      console.error('Error downloading video:', response.data)
    }
  }

  return <div className="h-screen flex justify-center">
      <div className='flex items-center font-bold '>
        <div className='flex flex-col p-2 '>
          <div>
            <TitlePage title='Duck Tools - Youtube'/>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-1'>
                <FormField
                  control={form.control}
                  name='url'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Youtube URL' 
                          type='url' 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mt-2.5'>
                <Button className='w-full cursor-pointer'>
                  <Download />
                  Baixar Vídeo
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
}
