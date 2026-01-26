export interface RenderResponse {
  cdnUrl: string;
  html: string;
  name: string;
  props: Record<string, unknown>;
}

export interface CKLoaderConfig {
  host: string;
}

export interface CKComponentProps {
  host: string;
  renderData: RenderResponse;
}
