package de.filiadata.datahub.business;

import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Test;

import java.util.Collections;
import java.util.Map;

import static org.mockito.Mockito.*;

public class ServicePropertiesServiceUnitTest {

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final ConsumerPropertiesService consumerPropertiesService = mock(ConsumerPropertiesService.class);
    private final CustomPropertiesService customPropertiesService = mock(CustomPropertiesService.class);
    private final ServiceAddDeleteService serviceAddDeleteService = mock(ServiceAddDeleteService.class);
    private final PropertiesContentProviderService propertiesContentProviderService = mock(PropertiesContentProviderService.class);
    private final ServicePropertiesService service = new ServicePropertiesService(propertiesContentProviderService,
            servicePropertiesRepository,
            consumerPropertiesService,
            customPropertiesService,
            serviceAddDeleteService);

    @Test
    public void shouldDelegateToContentProvider() throws Exception {
        // when
        service.getServicesWithContent();

        // then
        verify(propertiesContentProviderService).getAllServicesWithContent();
    }

    @Test
    public void shouldDeletegateToCustomPropertiesServiceToAddOrUpdateProperties() throws Exception {
        // given
        final String serviceName = "serviceName";
        final Map<String, String> properties = Collections.emptyMap();

        // when
        service.addProperties(serviceName, properties);

        // then
        verify(customPropertiesService).addSingleValueProperties(serviceName, properties);
    }

    @Test
    public void shouldDeletegateToCustomPropertiesServiceToDeleteProperties() throws Exception {
        // given
        final String serviceName = "fooName";
        String propertyName = "";

        // when
        service.deleteProperty(serviceName, propertyName);

        // then
        verify(customPropertiesService).deleteProperty(serviceName, Collections.singletonList(propertyName));
    }

    @Test
    public void shouldDelegateToConsumerServiceToCreateNewRelation() throws Exception {
        // given
        final String serviceName = "ultraServiceName";
        final String relatedServiceName = "relatedServiceName";

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(false);

        // when
        service.addRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).createAndSaveNewProperties(serviceName, relatedServiceName);
    }

    @Test
    public void shouldDelegateToConsumerServiceToUpdateRelations() throws Exception {
        // given
        final String serviceName = "ultraServiceName";
        final String relatedServiceName = "relatedServiceName";

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(true);

        // when
        service.addRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).addConsumedService(serviceName, relatedServiceName);
    }
}