import { LoginWrapper } from "@/app/_components/LoginWrapper";
import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export function LoginDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Share</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>ログインしてください</DialogTitle>
					{/* <DialogDescription>
            ログインしてください
          </DialogDescription> */}
				</DialogHeader>
				{/* <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div> */}
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<LoginWrapper>
							<Button type="button" variant="secondary">
								Googleでログイン
							</Button>
						</LoginWrapper>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
