export const getFirstSegment = (pathname: string) =>
	pathname.split("/").filter(Boolean).shift() ?? "";

export const getLastSegment = (pathname: string) =>
	pathname.split("/").filter(Boolean).pop() ?? "";
