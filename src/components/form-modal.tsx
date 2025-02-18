import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamFormValues {
  name: string;
}

interface MemberFormValues {
  name: string;
  email: string;
}

interface FormModalProps {
  type: "team" | "member";
  initialData?: TeamFormValues | MemberFormValues;
  onSubmit: (data: TeamFormValues | MemberFormValues) => void;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
}

export function FormModal({
  type,
  initialData,
  onSubmit,
  mode = "create",
  trigger,
}: FormModalProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<TeamFormValues | MemberFormValues>({
    defaultValues:
      initialData || (type === "team" ? { name: "" } : { name: "", email: "" }),
  });

  const handleSubmit = async (data: TeamFormValues | MemberFormValues) => {
    if (type === "member" && !("email" in data)) {
      return;
    }
    await onSubmit(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className={cn({ "w-full": type === "member" })}
            variant={type === "team" ? "default" : "outline"}
          >
            {mode === "create" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {type === "team" ? "Team" : "Member"}
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit {type === "team" ? "Team" : "Member"}
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add" : "Edit"}{" "}
            {type === "team" ? "Team" : "Member"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? type === "team"
                ? "Create a new team to organize your members."
                : "Add a new member to this team."
              : type === "team"
              ? "Edit team details."
              : "Edit member details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {type === "team" ? "Team Name" : "Member Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        type === "team"
                          ? "Enter team name"
                          : "Enter member name"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "member" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter member email"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end">
              <Button type="submit">
                {mode === "create" ? "Add" : "Save"}{" "}
                {type === "team" ? "Team" : "Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
