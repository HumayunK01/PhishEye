import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const osintSources = [
  "VirusTotal",
  "Google Safe Browsing",
  "URLScan.io",
  "WHOIS/RDAP",
  "Certificate Transparency",
  "DNS Analysis"
];

export default function LoadingSkeleton() {
  return (
    <div data-testid="loading-skeleton">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-xl"
        >
          <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-lg font-medium">Analyzing URL with OSINT sources...</span>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {osintSources.map((source, index) => (
          <motion.div
            key={source}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-3/4 h-3" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
                <div className="mt-4">
                  <Skeleton className="w-full h-8 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk Meter Loading */}
      <div className="mt-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Skeleton className="w-24 h-6 mx-auto mb-6" />
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Skeleton className="w-full h-full rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Skeleton className="w-12 h-8 mx-auto mb-2" />
                    <Skeleton className="w-16 h-4 mx-auto" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="w-20 h-8 mx-auto rounded-full" />
                <Skeleton className="w-48 h-4 mx-auto" />
                <Skeleton className="w-32 h-3 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-40 h-6" />
              </div>
              <div className="space-y-3 mb-8">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                    <Skeleton className="w-5 h-5 mt-0.5" />
                    <Skeleton className="flex-1 h-4" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="w-24 h-10 rounded-lg" />
                <Skeleton className="w-32 h-10 rounded-lg" />
                <Skeleton className="w-28 h-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
