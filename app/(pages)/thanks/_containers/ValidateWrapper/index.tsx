import {
	ValidateWrapperContainer,
	type ValidateWrapperContainerProps,
} from "./container";

export const ValidateWrapper = ({
	sessionId,
}: ValidateWrapperContainerProps) => (
	<ValidateWrapperContainer sessionId={sessionId} />
);
