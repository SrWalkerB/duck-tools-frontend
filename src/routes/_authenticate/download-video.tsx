import { TitlePage } from '@/components/title-page'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertCircleIcon, CheckCircle2Icon, Circle, CircuitBoard, Download, LoaderIcon, Search, Terminal } from "lucide-react";
import { api } from '@/lib/axios'
import { CreateDownloadFile } from '@/util/create-download-file'
import { useMutation } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticate/download-video')({
  component: RouteComponent,
})

const urlSchema = z.object({
  url: z.url({error: "Invalid URL"})
})

interface SearchVideoResponse {
  title: string
  thumbnail: string
  duration: string
}

function RouteComponent() {
  const [haveVideo, setHaveVideo] = useState(false);

  const searchVideo = useMutation({
    mutationFn: async (values: z.infer<typeof urlSchema>) => {
      return api.get<SearchVideoResponse>('/youtube/search-video', { params: values })
    },
    onSuccess(response) {
      console.log('Video info:', response.data)
      setHaveVideo(true)
      return response.data as SearchVideoResponse;
    },
    onError(error, variables, context) {
      console.log(error.cause)
    },
  })
  const downloadVideoMutation = useMutation({
    mutationFn: async (values: z.infer<typeof urlSchema>) => {
      return api.post('/youtube/download-video', values, {
        responseType: 'blob'
      })
    },
    onSuccess(response) {
      let filename = `video.mp4`
      CreateDownloadFile(response.data, filename)
      console.log('Video downloaded successfully')
      setHaveVideo(false)
    },
    onError(error, variables, context) {
      console.log(error.cause)
    },
  })

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: 'https://www.youtube.com/watch?v=2AilA-M6N5U&list=RDE5488fUMLXs&index=2',
    },
  })

  const onSubmit =  async (values: z.infer<typeof urlSchema>) => {
    if(!haveVideo) return searchVideo.mutate(values)

    downloadVideoMutation.mutate(values)
  }

  return <div className="h-screen flex justify-center">
      <div className='flex items-center font-bold '>
        <div className='flex flex-col p-2 '>
          <div>
            <TitlePage title='Duck Tools - Youtube'/>
          </div>

          <div className='p-1'>
            {downloadVideoMutation.isError && !downloadVideoMutation.isPending && (
              <Alert variant={"destructive"}>
                <AlertCircleIcon />
                <AlertTitle>Error download video</AlertTitle>
                <AlertDescription>
                  {downloadVideoMutation.error instanceof Error ? downloadVideoMutation.error.message : 'An error occurred while downloading the video.'}
                </AlertDescription>
              </Alert>
            )}
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

              <div>
                {searchVideo.isError && !searchVideo.isPending && (
                  <Alert variant={"destructive"} className='mt-2.5'>
                    <AlertCircleIcon />
                    <AlertTitle>Error search video</AlertTitle>
                    <AlertDescription>
                      {searchVideo.error instanceof Error ? searchVideo.error.message : 'An error occurred while searching the video.'}
                    </AlertDescription>
                  </Alert>
                )}

                {searchVideo.isSuccess && !searchVideo.isPending && (
                  <Alert className='mt-2.5'>
                    <CheckCircle2Icon />
                    <AlertTitle>Video found</AlertTitle>
                    <AlertDescription>
                      {`${searchVideo.data.data.title}`}
                    </AlertDescription>

                    <AlertDescription>
                      {`Duration: ${(Number(searchVideo.data.data.duration)/60).toFixed(2)} minutes`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className='mt-3'>
                {
                  haveVideo ? 
                  <Button 
                  className='w-full cursor-pointer' 
                  disabled={downloadVideoMutation.isPending}
                  >
                    {
                      downloadVideoMutation.isPending ? <LoaderIcon className='animate-spin' /> : 
                      <Download />
                    }
                    Download Vídeo 
                  </Button>
                  : 
                  <Button 
                  className='w-full cursor-pointer' 
                  disabled={searchVideo.isPending}
                  >
                    {
                      searchVideo.isPending ? <LoaderIcon className='animate-spin' /> : 
                      <Search />
                    }
                    Search Vídeo 
                  </Button>
                }
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
}
