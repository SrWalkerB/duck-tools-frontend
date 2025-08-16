import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from  "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { TitlePage } from '@/components/title-page'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.email({error: "Invalid email address"}),
  password: z.string().min(6).max(100),
})

function RouteComponent() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log('Form submitted:', values)
  }

  return (
    <div className="h-screen flex justify-center">
      <div className='flex items-center font-bold '>
        <div className='flex flex-col p-2 '>
          <div>
            <TitlePage title='Duck Tools'/>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-1'>
                <FormField 
                  control={form.control}
                  name='email'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder='Email' 
                          type='email' 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField 
                  control={form.control}
                  name='password'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder='Password' 
                          type='password' 
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
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
