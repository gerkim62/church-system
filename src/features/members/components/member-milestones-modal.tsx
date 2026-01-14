import { Award } from 'lucide-react'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'
import useModalState from '@/hooks/use-modal-state'
import { useIsMobile } from '@/hooks/use-mobile'

interface MemberMilestonesModalProps {
  memberId: string
  memberName: string
    children: React.ReactNode,

    hideOnMobile?: boolean
    hideOnDesktop?: boolean
}

export function MemberMilestonesModal({
  memberId,
  memberName,
  children,
    hideOnMobile,
    hideOnDesktop,
}: MemberMilestonesModalProps) {
  const { isOpen, setIsOpen } = useModalState({
      paramName: 'milestones-modal',
    openValue: memberId,
      from: "/members",
  })

    const isMobile = useIsMobile()

    if ((hideOnMobile && isMobile) || (hideOnDesktop && !isMobile)) {
        return null;
    }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            {memberName}'s Milestones
          </CredenzaTitle>
          <CredenzaDescription>
            View all milestones achieved by this member
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {/* TODO: Fetch and display milestones */}
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Milestone details will be displayed here.
            </p>
          </div>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
