import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, Search, Eye, Key, Info, Server, Check, X, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface EvidenceCardProps {
  sourceName: string;
  sourceData: {
    status: "success" | "error" | "timeout" | "blocked";
    data?: any;
    error?: string;
  };
}

const sourceConfig = {
  whoisRdap: {
    name: "WHOIS/RDAP",
    description: "Domain registration",
    icon: Info,
  },
  virustotal: {
    name: "VirusTotal",
    description: "Multi-engine scan",
    icon: Shield,
  },
  urlscan: {
    name: "URLScan.io",
    description: "Behavioral analysis",
    icon: Eye,
  },
  googleSafeBrowsing: {
    name: "Google Safe Browsing",
    description: "Threat detection",
    icon: Search,
  },
  certificateTransparency: {
    name: "Certificate Transparency",
    description: "SSL/TLS certificates",
    icon: Key,
  },
  dnsAnalysis: {
    name: "DNS Analysis",
    description: "Infrastructure analysis",
    icon: Server,
  },
};

export default function EvidenceCard({ sourceName, sourceData }: EvidenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const config = sourceConfig[sourceName as keyof typeof sourceConfig];
  const IconComponent = config?.icon || Shield;

  const getStatusBadge = () => {
    switch (sourceData.status) {
      case "success":
        return (
          <Badge variant="default" className="bg-success/20 text-success">
            <Check className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case "timeout":
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            <Clock className="w-3 h-3 mr-1" />
            Timeout
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const renderSourceData = () => {
    if (sourceData.status === "blocked" && sourceData.data) {
      return (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-orange-600">Blocked from scanning</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reason:</span>
            <span className="font-medium">{sourceData.data.reason || "URL restricted"}</span>
          </div>
        </div>
      );
    }
    
    if (sourceData.status !== "success" || !sourceData.data) {
      return (
        <div className="text-sm text-muted-foreground">
          {sourceData.error || "No data available"}
        </div>
      );
    }

    const data = sourceData.data;

    switch (sourceName) {
      case "whoisRdap":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain Age:</span>
              <span className="font-medium">
                {data.age_days ? `${Math.floor(data.age_days / 365)} years` : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registrar:</span>
              <span className="font-medium">{data.registrar || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Privacy:</span>
              <span className={`font-medium ${data.privacy_protected ? 'text-warning' : 'text-success'}`}>
                {data.privacy_protected ? 'Protected' : 'Public'}
              </span>
            </div>
          </div>
        );

      case "virustotal":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Detections:</span>
              <span className={`font-medium ${data.positives > 0 ? 'text-destructive' : 'text-success'}`}>
                {data.positives || 0}/{data.total || 0} engines
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-medium ${data.positives > 0 ? 'text-destructive' : 'text-success'}`}>
                {data.positives > 0 ? 'Threats Found' : 'Clean'}
              </span>
            </div>
            {data.scan_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Scan:</span>
                <span className="font-medium">
                  {new Date(data.scan_date * 1000).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        );

      case "urlscan":
        return (
          <div className="space-y-2 text-sm">
            {data.status === 'blocked' ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-orange-600">Cannot Scan</span>
                </div>
                <div className="text-xs text-muted-foreground italic">
                  {data.message || "This URL cannot be scanned"}
                </div>
              </div>
            ) : data.status === 'pending' ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-warning">Scanning...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Malicious:</span>
                  <span className={`font-medium ${data.malicious ? 'text-destructive' : 'text-success'}`}>
                    {data.malicious ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suspicious:</span>
                  <span className={`font-medium ${data.suspicious ? 'text-warning' : 'text-success'}`}>
                    {data.suspicious ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technologies:</span>
                  <span className="font-medium">{data.technologies?.length || 0} detected</span>
                </div>
              </>
            )}
          </div>
        );

      case "googleSafeBrowsing":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Threats:</span>
              <span className={`font-medium ${data.threats_found ? 'text-destructive' : 'text-success'}`}>
                {data.threats_found ? `${data.threat_count} found` : 'None detected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-medium ${data.threats_found ? 'text-destructive' : 'text-success'}`}>
                {data.threats_found ? 'Listed' : 'Not listed'}
              </span>
            </div>
            {data.threat_types?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Types:</span>
                <span className="font-medium text-destructive">
                  {data.threat_types.join(', ')}
                </span>
              </div>
            )}
          </div>
        );

      case "certificateTransparency":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificates:</span>
              <span className="font-medium">{data.total_certificates || 0} found</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent (7d):</span>
              <span className={`font-medium ${data.certificate_churn ? 'text-warning' : 'text-success'}`}>
                {data.recent_certificates || 0}
              </span>
            </div>
            {data.latest_cert && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latest Issuer:</span>
                <span className="font-medium">
                  {data.latest_cert.issuer_name?.split(',')[0] || 'Unknown'}
                </span>
              </div>
            )}
          </div>
        );

      case "dnsAnalysis":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">A Records:</span>
              <span className="font-medium">{data.a_records?.length || 0} found</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MX Records:</span>
              <span className="font-medium">{data.mx_records?.length || 0} found</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SPF/DMARC:</span>
              <span className={`font-medium ${data.has_spf && data.has_dmarc ? 'text-success' : 'text-warning'}`}>
                {data.has_spf && data.has_dmarc ? 'Complete' : 'Partial'}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Data format not recognized
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card hover:bg-accent/10 transition-all duration-200 h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{config?.name || sourceName}</h4>
                <p className="text-xs text-muted-foreground">{config?.description || ""}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Main Data Display */}
          <div className="mb-4">
            {renderSourceData()}
          </div>

          {/* Expand/Collapse for Full Details */}
          {sourceData.status === "success" && sourceData.data && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-xs p-2 h-8"
                  data-testid={`button-expand-${sourceName}`}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      View Full Report
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="p-3 bg-accent/5 rounded-lg">
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-40 custom-scrollbar">
                    {JSON.stringify(sourceData.data, null, 2)}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
