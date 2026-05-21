<script lang="ts">
import { siteIconFallback, siteIconSvgs } from "@/generated/site-icon-svgs";

interface Props {
    icon: string;
    class?: string;
}

let { icon, class: className = "" }: Props = $props();

const svg = $derived(siteIconSvgs[icon] ?? siteIconFallback);
</script>

<span class={`inline-flex items-center justify-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em] ${className}`}>
    {@html svg}
</span>
