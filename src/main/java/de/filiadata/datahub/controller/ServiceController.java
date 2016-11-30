package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private ContentService contentService;

    @Autowired
    public ServiceController(ContentService contentService) {
        this.contentService = contentService;
    }

    @RequestMapping
    public Collection<ObjectNode> readServiceNames() {
        return contentService.getServicesWithContent();
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.POST)
    public void addService(@PathVariable String serviceName, @RequestBody ObjectNode dto) {
        contentService.createNewServiceInfo(serviceName, dto);
    }

    @RequestMapping(value = "/{serviceName}/consumes", method = RequestMethod.PUT)
    public void updateConsumer(@PathVariable String serviceName, @RequestBody String consumedServiceId) {
        contentService.createNewConsumerRelation(consumedServiceId, serviceName);
    }
}
