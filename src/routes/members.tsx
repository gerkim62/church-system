import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePaginatedQuery } from 'convex/react'
import { useDebounce } from 'use-debounce'
import {
  Award,
  Calendar,
  ChevronRight,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import z from 'zod'
import { api } from '../../convex/_generated/api'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MemberMilestonesModal } from '@/features/members/components/member-milestones-modal'
import { cn } from '@/lib/utils'
import { formatDate, formatFullDate } from '@/lib/formatters'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { authClient } from '@/lib/auth-client'
import { unauthorized } from '~/convex/helpers/errorHelpers'

export const Route = createFileRoute('/members')({
  component: MembersPage,
  validateSearch: z.object({
    'milestones-modal': z.string().optional(),
  }),
})

function MembersPage() {
  // All hooks must be called at the top, before any conditional returns
  const session = authClient.useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 300)
  const itemsPerPage = 10

  // Only fetch members data when authenticated
  // Skip the query if not authenticated
  const {
    results: members,
    status,
    loadMore,
    isLoading
  } = usePaginatedQuery(
    api.members.list,
    session.data ? { search: debouncedSearch } : 'skip',
    { initialNumItems: itemsPerPage },
  )

  const handleEditMember = (memberId: string, memberName: string) => {
    // TODO: Open edit modal or navigate to edit page
    console.log(`Edit member: ${memberName} (${memberId})`)
  }

  const handleDeleteMember = (memberId: string, memberName: string) => {
    // TODO: Open delete confirmation dialog
    console.log(`Delete member: ${memberName} (${memberId})`)
  }

  // Show loading state while checking authentication
  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show sign in prompt if not authenticated
  if (!session.data) {
   throw unauthorized()
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                Church Members
              </h1>
            </div>
            <Button
              size="lg"
              className="gap-2 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </div>

          {/* Main Content Card */}
          <Card className="overflow-hidden border-0 bg-card/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-medium">
                  All Members
                </CardTitle>
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/80 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Loading State */}
              {isLoading ? (
                <>
                  {/* Mobile: Loading Skeleton */}
                  <div className="md:hidden divide-y divide-border/50">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Loading Skeleton */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Phone</TableHead>
                          <TableHead className="font-semibold text-center">
                            Milestones
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Member Since
                          </TableHead>
                          <TableHead className="font-semibold text-right w-17.5">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-48" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell className="text-center">
                              <Skeleton className="h-6 w-12 rounded-full mx-auto" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-4 w-24 ml-auto" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : members.length === 0 ? (
                /* Empty State */
                <Empty className="py-16">
                  <EmptyHeader>
                    <EmptyMedia
                      variant="icon"
                      className="size-14 rounded-full bg-muted"
                    >
                      <Users className="size-7 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>No members found</EmptyTitle>
                    <EmptyDescription>
                      {searchQuery
                        ? 'Try adjusting your search terms or clear the search'
                        : 'Get started by adding church members'}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <>
                  {/* Mobile: Accordion List */}
                  <div className="md:hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {members.map((member) => (
                        <AccordionItem
                          key={member.id}
                          value={member.id}
                          className="border-border/50"
                        >
                          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/40 data-[state=open]:bg-muted/30">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Avatar */}
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/10">
                                {member.name
                                  ? member.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .slice(0, 2)
                                  : '??'}
                              </div>

                              {/* Name and email */}
                              <div className="flex-1 min-w-0 text-left">
                                <p className="font-medium text-foreground truncate">
                                  {member.name}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {member.email}
                                </p>
                              </div>

                              {/* Milestones badge - Hidden on mobile, shown only in badge on desktop */}
                              <Badge
                                variant={
                                  member.milestonesAchieved.length > 0
                                    ? 'default'
                                    : 'secondary'
                                }
                                className={cn(
                                  'shrink-0 gap-1 mr-2 hidden',
                                  member.milestonesAchieved.length > 0 &&
                                    'bg-linear-to-r from-amber-500 to-orange-500',
                                )}
                              >
                                <Award className="h-3 w-3" />
                                {member.milestonesAchieved.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="bg-muted/20 pb-4">
                            <div className="space-y-3 px-4 pt-2">
                              {/* Email */}
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="pt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {member.email}
                                  </p>
                                </div>
                              </div>

                              {/* Phone */}
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="pt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Phone
                                  </p>
                                  <p
                                    className={cn(
                                      'text-sm text-foreground',
                                      member.phoneNumber
                                        ? ''
                                        : 'text-muted-foreground',
                                    )}
                                  >
                                    {member.phoneNumber || 'Not provided'}
                                  </p>
                                </div>
                              </div>

                              {/* Member Since */}
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="pt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Member Since
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {formatFullDate(member.memberSince)}
                                  </p>
                                </div>
                              </div>

                              {/* Milestones Button */}
                              <MemberMilestonesModal
                                memberId={member.id}
                                memberName={member.name}
                                hideOnDesktop
                              >
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-3 w-full rounded-lg bg-linear-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/20 transition-all p-3"
                                >
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-500 shadow-md">
                                    <Award className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-xs font-medium text-amber-600">
                                      Milestones
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                      {member.milestonesAchieved.length}{' '}
                                      achieved
                                    </p>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-amber-500" />
                                </button>
                              </MemberMilestonesModal>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-2 mt-2 border-t border-border/50">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 gap-2"
                                  onClick={() =>
                                    handleEditMember(member.id, member.name)
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                  onClick={() =>
                                    handleDeleteMember(member.id, member.name)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Phone</TableHead>
                          <TableHead className="font-semibold text-center">
                            Milestones
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Member Since
                          </TableHead>
                          <TableHead className="font-semibold text-right w-17.5">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow
                            key={member.id}
                            className="group cursor-pointer transition-colors hover:bg-muted/40"
                          >
                            {/* Name */}
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/10">
                                  {member.name
                                    ? member.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                    : '??'}
                                </div>
                                <span className="group-hover:text-primary transition-colors">
                                  {member.name}
                                </span>
                              </div>
                            </TableCell>

                            {/* Email */}
                            <TableCell>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="max-w-50 truncate">
                                  {member.email}
                                </span>
                              </div>
                            </TableCell>

                            {/* Phone */}
                            <TableCell>
                              {member.phoneNumber ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  <span>{member.phoneNumber}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground/50">
                                  —
                                </span>
                              )}
                            </TableCell>

                            {/* Milestones */}
                            <TableCell className="text-center">
                              <Tooltip>
                                <MemberMilestonesModal
                                  memberId={member.id}
                                  memberName={member.name}
                                  hideOnMobile
                                >
                                  <TooltipTrigger asChild>
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation()
                                      }}
                                      className="inline-flex items-center"
                                    >
                                      <Badge
                                        variant={
                                          member.milestonesAchieved.length > 0
                                            ? 'default'
                                            : 'secondary'
                                        }
                                        className={cn(
                                          'cursor-pointer gap-1.5 transition-all hover:scale-105',
                                          member.milestonesAchieved.length >
                                            0 &&
                                            'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm',
                                        )}
                                      >
                                        <Award className="h-3 w-3" />
                                        {member.milestonesAchieved.length}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                </MemberMilestonesModal>
                                <TooltipContent>
                                  <p>
                                    {member.milestonesAchieved.length > 0
                                      ? `View ${member.milestonesAchieved.length} milestone${member.milestonesAchieved.length > 1 ? 's' : ''}`
                                      : 'No milestones achieved yet'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>

                            {/* Member Since */}
                            <TableCell className="text-right text-muted-foreground">
                              {formatDate(member.memberSince)}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditMember(member.id, member.name)
                                    }
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteMember(member.id, member.name)
                                    }
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {/* Pagination */}
              {members.length > 0 && (
                <div className="border-t bg-muted/20 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      Showing {members.length} member
                      {members.length !== 1 ? 's' : ''}
                    </p>
                    {status === 'CanLoadMore' && (
                      <Button
                        onClick={() => loadMore(itemsPerPage)}
                        variant="outline"
                        size="sm"
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
