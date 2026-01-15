import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Church, Plus, Users } from 'lucide-react'

export const Route = createFileRoute('/_authed/ob/no-church')({
  component: NoChurchPage,
})

function NoChurchPage() {
  return (
    <div className="flex items-center justify-center p-4 bg-linear-to-b from-background to-muted/30 py-8 sm:py-12">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Church className="h-8 w-8 text-primary" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            You're not part of a church yet
          </h1>
          <p className="text-muted-foreground">
            To get started, you can either register your church or ask your church leaders to add you.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/ob/register-church" className="block">
            <Button size="lg" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Register My Church
            </Button>
          </Link>

          <Card className="bg-muted/40 border-dashed">
            <CardContent className="py-5">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Already a member?</p>
                  <p className="text-muted-foreground">
                    Ask your pastor or church admin to add you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
