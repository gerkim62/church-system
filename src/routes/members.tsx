import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Search,
  UserPlus,
  Users,
  Phone,
  Mail,
  Award,
  ChevronRight,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsivePagination } from '@/components/responsive-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
import z from 'zod'

export const Route = createFileRoute('/members')({
  component: MembersPage,
  validateSearch: z.object({
    "milestones-modal": z.string().optional(),
  })
})

// Mock data for UI demonstration
const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    milestonesCount: 5,
    memberSince: new Date('2023-11-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: null,
    milestonesCount: 12,
    memberSince: new Date('2022-01-08'),
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '+254 798 765 432',
    milestonesCount: 3,
    memberSince: new Date('2024-03-22'),
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+254 723 456 789',
    milestonesCount: 8,
    memberSince: new Date('2023-06-10'),
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: null,
    milestonesCount: 0,
    memberSince: new Date('2025-01-02'),
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+254 711 222 333',
    milestonesCount: 15,
    memberSince: new Date('2021-08-19'),
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+254 733 444 555',
    milestonesCount: 7,
    memberSince: new Date('2023-02-14'),
  },
  {
    id: '8',
    name: 'Grace Mwangi',
    email: 'grace.m@example.com',
    phone: null,
    milestonesCount: 4,
    memberSince: new Date('2024-07-30'),
  },
  {
    id: '9',
    name: 'Peter Ochieng',
    email: 'peter.o@example.com',
    phone: '+254 700 111 222',
    milestonesCount: 9,
    memberSince: new Date('2022-11-05'),
  },
  {
    id: '10',
    name: 'Mary Wanjiku',
    email: 'mary.w@example.com',
    phone: '+254 722 333 444',
    milestonesCount: 11,
    memberSince: new Date('2022-04-18'),
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalMembers = 124 // Mock total for pagination demo
  const totalPages = Math.ceil(totalMembers / itemsPerPage)

  // Filter members based on search query (mock client-side filtering)
  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery))
  )

  const handleMilestoneClick = (memberId: string, memberName: string) => {
    // TODO: Open modal or navigate to milestones page
    console.log(`View milestones for ${memberName} (${memberId})`)
  }

  const handleEditMember = (memberId: string, memberName: string) => {
    // TODO: Open edit modal or navigate to edit page
    console.log(`Edit member: ${memberName} (${memberId})`)
  }

  const handleDeleteMember = (memberId: string, memberName: string) => {
    // TODO: Open delete confirmation dialog
    console.log(`Delete member: ${memberName} (${memberId})`)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                Members
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {totalMembers}
                </span>{' '}
                total members in your church
              </p>
            </div>
            <Button className="gap-2 shadow-md transition-all hover:shadow-lg w-full sm:w-auto">
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
              {/* Empty State */}
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <Users className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No members found
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile: Accordion List */}
                  <div className="md:hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredMembers.map((member) => (
                        <AccordionItem
                          key={member.id}
                          value={member.id}
                          className="border-border/50"
                        >
                          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/40 [&[data-state=open]]:bg-muted/30">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Avatar */}
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/10">
                                {member.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
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

                              {/* Milestones badge */}
                              <Badge
                                variant={
                                  member.milestonesCount > 0
                                    ? 'default'
                                    : 'secondary'
                                }
                                className={`shrink-0 gap-1 mr-2 ${
                                  member.milestonesCount > 0
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : ''
                                }`}
                              >
                                <Award className="h-3 w-3" />
                                {member.milestonesCount}
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
                                  <p className="text-sm text-foreground">
                                    {member.phone || 'Not provided'}
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
                              <button
                                onClick={() =>
                                  handleMilestoneClick(member.id, member.name)
                                }
                                className="flex items-center gap-3 w-full rounded-lg bg-background/60 hover:bg-background transition-colors"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                  <Award className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="flex-1 text-left py-2">
                                  <p className="text-xs text-muted-foreground">
                                    Milestones
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {member.milestonesCount} achieved
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground mr-3" />
                              </button>

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
                          <TableHead className="font-semibold text-right w-[70px]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((member) => (
                          <TableRow
                            key={member.id}
                            className="group cursor-pointer transition-colors hover:bg-muted/40"
                          >
                            {/* Name */}
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/10">
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)}
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
                                <span className="max-w-[200px] truncate">
                                  {member.email}
                                </span>
                              </div>
                            </TableCell>

                            {/* Phone */}
                            <TableCell>
                              {member.phone ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5 shrink-0" />
                                  <span>{member.phone}</span>
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
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMilestoneClick(
                                        member.id,
                                        member.name
                                      )
                                    }}
                                    className="inline-flex items-center"
                                  >
                                    <Badge
                                      variant={
                                        member.milestonesCount > 0
                                          ? 'default'
                                          : 'secondary'
                                      }
                                      className={`cursor-pointer gap-1.5 transition-all hover:scale-105 ${
                                        member.milestonesCount > 0
                                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm'
                                          : ''
                                      }`}
                                    >
                                      <Award className="h-3 w-3" />
                                      {member.milestonesCount}
                                    </Badge>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {member.milestonesCount > 0
                                      ? `View ${member.milestonesCount} milestone${member.milestonesCount > 1 ? 's' : ''}`
                                      : 'No milestones yet'}
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
                                <DropdownMenuContent align="end" className="w-40">
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
              {filteredMembers.length > 0 && (
                <div className="border-t bg-muted/20 px-4 py-3">
                  <ResponsivePagination
                    meta={{
                      page: currentPage,
                      totalPages: totalPages,
                      hasNext: currentPage < totalPages,
                      hasPrev: currentPage > 1,
                      limit: itemsPerPage,
                      total: totalMembers,
                    }}
                    onPageChange={setCurrentPage}
              
                    itemName="members"
                  />
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
